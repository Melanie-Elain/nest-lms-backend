import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Question } from './entities/question.entity';
import { CreateQuestionBankDto } from './dto/create-question-bank.dto';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    
  ) {}

  async createBankQuestion(dto: CreateQuestionBankDto) {
    const newQuestion = this.questionRepository.create({
      content: dto.content,
      points: dto.points,
      type: dto.type,
      options: dto.options, 
    });

    return await this.questionRepository.save(newQuestion);
  }

  async getQuestionBank() {
    return await this.questionRepository.find({
      where: { quiz: IsNull() }, 
      relations: ['options'],    
      order: { id: 'DESC' }      
    });
  }

  
}