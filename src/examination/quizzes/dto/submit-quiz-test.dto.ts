// import { ApiProperty } from '@nestjs/swagger';
// import { Type } from 'class-transformer';
// import { IsArray, IsNumber, ValidateNested } from 'class-validator';

// // Định nghĩa cấu trúc cho 1 câu trả lời
// class AnswerDto {
//   @ApiProperty({ description: 'ID của câu hỏi', example: 1 })
//   @IsNumber()
//   questionId: number;

//   @ApiProperty({ description: 'ID của đáp án được chọn', example: 2 })
//   @IsNumber()
//   selectedOptionId: number;
// }

// // Định nghĩa cấu trúc tổng thể khi nộp bài
// export class SubmitQuizDto {
//   @ApiProperty({ type: [AnswerDto], description: 'Danh sách các câu trả lời' })
//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => AnswerDto)
//   answers: AnswerDto[];
// }