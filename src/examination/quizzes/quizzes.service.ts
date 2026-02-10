import {Injectable} from '@nestjs/common';
import {CreateQuizDto} from './dto/create-quiz.dto';
import {Quiz} from './entities/quiz.entity';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import { UpdateQuizDto } from './dto/update-quiz.dto';

@Injectable()
export class QuizzesService {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,
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
}