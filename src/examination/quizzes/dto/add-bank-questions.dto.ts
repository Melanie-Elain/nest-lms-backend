import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

export class AddBankQuestionsDto {
  @ApiProperty({ 
    example: [1, 2, 5], 
    description: 'Mảng chứa ID của các câu hỏi từ Ngân hàng muốn thêm vào Đề thi' 
  })
  @IsArray()
  @IsNumber({}, { each: true }) // Đảm bảo mỗi phần tử trong mảng đều là số
  questionIds: number[];
}