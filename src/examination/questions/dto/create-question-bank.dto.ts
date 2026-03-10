import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { QuestionType } from '../entities/question.entity';

class CreateOptionDto {
  @ApiProperty({ example: 'NestJS là một framework Node.js' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  isCorrect: boolean;
}

export class CreateQuestionBankDto {
  @ApiProperty({ example: 'Decorator nào đánh dấu một class là Injectable?' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: 5, description: 'Điểm của câu hỏi' })
  @IsNumber()
  points: number;

  @ApiProperty({ enum: QuestionType, example: QuestionType.SINGLE })
  @IsEnum(QuestionType)
  @IsOptional()
  type: QuestionType;

  @ApiProperty({ 
    type: [CreateOptionDto],
    example: [
      { content: '@Injectable()', isCorrect: true },
      { content: '@Controller()', isCorrect: false }
    ]
  })
  @IsArray()
  @ArrayMinSize(2, { message: 'Phải có ít nhất 2 đáp án' })
  @ValidateNested({ each: true })
  @Type(() => CreateOptionDto)
  options: CreateOptionDto[];
}