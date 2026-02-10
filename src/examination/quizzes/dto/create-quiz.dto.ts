import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { QuestionType } from "src/examination/questions/entities/question.entity";


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
  @ApiProperty({ example: 'NestJS là gì?' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  points: number;

  @ApiProperty({ enum: QuestionType, example: QuestionType.SINGLE })
  @IsEnum(QuestionType)
  @IsOptional() // Có thể để trống, mặc định là SINGLE
  type: QuestionType;

  @ApiProperty({ type: [CreateOptionDto] })
  @IsArray()
  @ArrayMinSize(2, { message: 'Một câu hỏi phải có ít nhất 2 lựa chọn' })
  @ValidateNested({ each: true }) // Validate từng phần tử bên trong mảng
  @Type(() => CreateOptionDto)
  options: CreateOptionDto[];

}

export class CreateQuizDto {
  @ApiProperty({ example: 'Quiz về lập trình web' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Đây là một quiz để kiểm tra kiến thức về lập trình web.',required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 45, description: 'Thời gian làm bài (phút)' })
  @IsNumber()
  timeLimit: number;

  @ApiProperty({ example: 50, description: 'Điểm đạt' })
  @IsNumber()
  passScore: number;

  @ApiProperty({ example: 1, description: 'ID khóa học' })
  @IsNumber()
  courseId: number;

  @ApiProperty({ type: [CreateQuestionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];
}



