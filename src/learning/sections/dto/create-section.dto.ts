import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateSectionDto {
  @ApiProperty({ 
    example: 'Tổng quan về Hệ thống', 
    description: 'Chỉ cần nhập tên chương, hệ thống sẽ tự thêm tiền tố "Chương X:"' 
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ 
    example: 1, 
    description: 'ID của khóa học (Course) chứa chương này' 
  })
  @IsNumber()
  @IsNotEmpty()
  courseId: number;

  
}