import {BadRequestException, Inject, Injectable, NotFoundException} from '@nestjs/common';
import {CreateQuizDto} from './dto/create-quiz.dto';
import {Quiz} from './entities/quiz.entity';
import {InjectRepository} from '@nestjs/typeorm';
import {In, IsNull, Repository} from 'typeorm';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { Submission } from '../submissions/entities/submission.entity';
import { SubmissionAnswer } from '../submissions/entities/submission-answer.entity';
import { Question } from '../questions/entities/question.entity';
import { AddBankQuestionsDto } from './dto/add-bank-questions.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Section } from 'src/learning/sections/entities/section.entity';

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
    
    @Inject(CACHE_MANAGER) private cacheManager: Cache,

    @InjectRepository(Section)
    private readonly sectionRepository: Repository<Section>,
  ) {}

  async create(createQuizDto: CreateQuizDto): Promise<Quiz> {
    if (createQuizDto.sectionId) {
      const section = await this.sectionRepository.findOne({
          where: { id: createQuizDto.sectionId }
      });

      if (!section) {
          throw new NotFoundException(`Chương học (Section) ID ${createQuizDto.sectionId} không tồn tại!`);
      }

      // Kiểm tra xem Section đó có thuộc về CourseId trong DTO không
      if (section.courseId !== createQuizDto.courseId) {
          throw new BadRequestException(
              `Chương học này thuộc về khóa học khác (Course ID: ${section.courseId}), không phải khóa học ID ${createQuizDto.courseId}`
          );
      }
    }
    const quiz = this.quizRepository.create({
        ...createQuizDto,
        questions: createQuizDto.questions.map(q => ({
          ...q,
          options: q.options
        }))
      });

    const savedQuiz = await this.quizRepository.save(quiz); 
    
    await this.cacheManager.del('list_all_quizzes');
    
    return savedQuiz;
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

    const savedQuiz = await this.quizRepository.save(updatedQuiz);

    await this.cacheManager.del('all_quizzes'); 
    await this.cacheManager.del(`quiz_detail_${id}`); 

    return savedQuiz;
  }

  async remove(id: number) {
    const result = await this.quizRepository.delete(id);

    await this.cacheManager.del('all_quizzes'); // <-- THÊM VÀO
    await this.cacheManager.del(`quiz_detail_${id}`); // <-- THÊM VÀO

    return result;
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

    await this.cacheManager.del('all_quizzes'); 
    await this.cacheManager.del(`quiz_detail_${quizId}`);

    return {
      message: `Đã sao chép thành công ${newQuestionsToSave.length} câu hỏi từ Ngân hàng vào Đề thi.`,
    };
  }
}