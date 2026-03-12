import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { QuestionsService } from './questions.service';
import { CreateQuestionBankDto } from './dto/create-question-bank.dto';

import { JwtAuthGuard } from 'src/iam/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/iam/auth/guards/roles.guard';
import { Roles } from 'src/iam/auth/decorators/roles.decorator';


@ApiTags('Questions Bank - Ngân hàng câu hỏi')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('questions/bank') 
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  @Roles('ADMIN', 'INSTRUCTOR')
  @ApiOperation({ summary: 'Thêm một câu hỏi mới vào Ngân hàng' })
  createToBank(@Body() createQuestionBankDto: CreateQuestionBankDto) {
    return this.questionsService.createBankQuestion(createQuestionBankDto);
  }

  @Get()
  @Roles('ADMIN', 'INSTRUCTOR')
  @ApiOperation({ summary: 'Lấy toàn bộ câu hỏi trong Ngân hàng' })
  getBankQuestions() {
    return this.questionsService.getQuestionBank();
  }
}