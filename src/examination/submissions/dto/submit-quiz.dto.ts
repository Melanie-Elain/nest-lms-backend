import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class SubmitAnswerDto {
  @ApiProperty({ example: 18, description: 'ID của Câu hỏi' })
  @IsNumber()
  questionId: number;

  @ApiProperty({ example: [5, 6], description: 'Mảng ID các Đáp án học sinh chọn' })
  @IsArray()
  @IsNumber({}, { each: true })
  optionIds: number[];
}

export class SubmitQuizDto {
  @ApiProperty({ type: [SubmitAnswerDto], description: 'Danh sách bài làm' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubmitAnswerDto)
  answers: SubmitAnswerDto[];
}