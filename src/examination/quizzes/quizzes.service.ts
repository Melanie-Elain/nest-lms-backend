import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {CreateQuizDto} from './dto/create-quiz.dto';
import {Quiz} from './entities/quiz.entity';
import {InjectRepository} from '@nestjs/typeorm';
import {In, IsNull, Repository} from 'typeorm';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { Submission } from '../submissions/entities/submission.entity';
import { SubmissionAnswer } from '../submissions/entities/submission-answer.entity';
import { Question } from '../questions/entities/question.entity';
import { AddBankQuestionsDto } from './dto/add-bank-questions.dto';

@Injectable()
export class QuizzesService {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,

    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,

    @InjectRepository(Submission)
    private submissionRepository: Repository<Submission>,
    
    @InjectRepository(SubmissionAnswer)
    private submissionAnswerRepository: Repository<SubmissionAnswer>,
  ) {}

  async create(createQuizDto: CreateQuizDto): Promise<Quiz> {
    const quiz = this.quizRepository.create({
        ...createQuizDto,
        questions: createQuizDto.questions.map(q => ({
          ...q,
          options: q.options
        }))
      });
    return await this.quizRepository.save(quiz);
  }

  async findAll(): Promise<Quiz[]> {
    return await this.quizRepository.find({
        relations: ['questions', 'questions.options'], // Load kèm câu hỏi và đáp án
      });
  }

  async findOne(id: number){
    return await this.quizRepository.findOne({
        where: { id },
        relations: ['questions', 'questions.options'],
      });
  }

  async update(id: number, updateQuizDto: UpdateQuizDto) {
    const quiz = await this.findOne(id); 
    if (!quiz) {
       throw new Error('Quiz not found');
    }
    const updatedQuiz = await this.quizRepository.preload({
      id: id,
      ...updateQuizDto,
    });

    if (!updatedQuiz) {
       throw new Error('Could not update quiz');
    }

    return this.quizRepository.save(updatedQuiz);
  }

  async remove(id: number) {
    return this.quizRepository.delete(id);
  }

  // 6. THÊM CÂU HỎI TỪ NGÂN HÀNG VÀO ĐỀ THI (CLONE)
  // ==========================================================
  async addQuestionsFromBank(quizId: number, dto: AddBankQuestionsDto) {
    // 6.1. Kiểm tra đề thi có tồn tại không
    const quiz = await this.quizRepository.findOne({ where: { id: quizId } });
    if (!quiz) throw new NotFoundException('Không tìm thấy đề thi này');

    // 6.2. Lấy các câu hỏi GỐC từ ngân hàng (chỉ lấy những câu có quiz_id là null)
    const bankQuestions = await this.questionRepository.find({
      where: { 
        id: In(dto.questionIds), 
        quiz: IsNull() // Đảm bảo nó thực sự nằm trong kho
      },
      relations: ['options'],
    });

    if (bankQuestions.length === 0) {
      throw new BadRequestException('Không tìm thấy câu hỏi hợp lệ trong Ngân hàng');
    }

    // 6.3. Tiến hành CLONE (Nhân bản)
    const newQuestionsToSave = bankQuestions.map(bankQ => {
      return this.questionRepository.create({
        content: bankQ.content,
        points: bankQ.points,
        type: bankQ.type,
        quiz: { id: quizId }, // Gán bản clone này cho Đề thi hiện tại
        
        // Clone luôn danh sách đáp án
        options: bankQ.options.map(opt => ({
          content: opt.content,
          isCorrect: opt.isCorrect
        }))
      });
    });

    // 6.4. Lưu toàn bộ bản Clone vào Database
    await this.questionRepository.save(newQuestionsToSave);

    return {
      message: `Đã sao chép thành công ${newQuestionsToSave.length} câu hỏi từ Ngân hàng vào Đề thi.`,
    };
  }
}