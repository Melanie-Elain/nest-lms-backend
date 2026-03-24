import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { QuestionType } from "src/examination/questions/entities/question.entity";
import { Min, Max } from 'class-validator';

export class CreateOptionDto {
  @ApiProperty({ example: 'NestJS là một framework Node.js' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  isCorrect: boolean;
}
 
export class CreateQuestionDto {
  @ApiProperty({ example: 'NestJS sử dụng ngôn ngữ lập trình nào làm mặc định?' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: 10, description: 'Điểm số của câu hỏi' })
  @IsNumber()
  points: number;

  @ApiProperty({ enum: QuestionType, example: QuestionType.SINGLE })
  @IsEnum(QuestionType)
  @IsOptional()
  type: QuestionType;

  // 👇 Điểm ăn tiền ở đây: Cung cấp hẳn mảng 4 đáp án mẫu để qua vòng @ArrayMinSize(2)
  @ApiProperty({ 
    type: [CreateOptionDto],
    example: [
      { content: 'TypeScript', isCorrect: true },
      { content: 'Python', isCorrect: false },
      { content: 'Java', isCorrect: false },
      { content: 'C++', isCorrect: false }
    ]
  })
  @IsArray()
  @ArrayMinSize(2, { message: 'Một câu hỏi phải có ít nhất 2 lựa chọn' })
  @ValidateNested({ each: true })
  @Type(() => CreateOptionDto)
  options: CreateOptionDto[];
}

export class CreateQuizDto {
  @ApiProperty({ example: 'Bài kiểm tra đầu vào NestJS' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ 
    example: 'Bài kiểm tra gồm các câu hỏi trắc nghiệm cơ bản về framework NestJS.',
    required: false 
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 15, description: 'Thời gian làm bài (phút)' })
  @IsNumber()
  @Min(5, { message: 'Thời gian thi tối thiểu là 5 phút' })
  @Max(180, { message: 'Thời gian thi tối đa là 180 phút' })
  timeLimit: number;

  @ApiProperty({ example: 50, description: 'Điểm đạt tối thiểu (Ví dụ: 50/100)' })
  @IsNumber()
  passScore: number;

  @ApiProperty({ example: 1, description: 'ID của khóa học chứa đề thi này' })
  @IsNumber()
  courseId: number;

  @ApiProperty({ 
    example: 1, 
    description: 'ID của chương học (Bỏ trống nếu là bài thi cuối khóa)', 
    required: false 
  })
  @IsNumber()
  @IsOptional() // Quan trọng: Để dùng chung cho cả Final Exam và Section Quiz
  sectionId?: number;

  @ApiProperty({ 
    type: [CreateQuestionDto],
    example: [
      {
        content: 'NestJS sử dụng ngôn ngữ lập trình nào làm mặc định?',
        points: 10,
        type: 'SINGLE',
        options: [
          { content: 'TypeScript', isCorrect: true },
          { content: 'PHP', isCorrect: false }
        ]
      },
      {
        content: 'Đâu là decorator dùng để đánh dấu một class là Controller trong NestJS?',
        points: 10,
        type: 'SINGLE',
        options: [
          { content: '@Injectable()', isCorrect: false },
          { content: '@Controller()', isCorrect: true },
          { content: '@Module()', isCorrect: false }
        ]
      }
    ]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];
}