import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSectionDto {
  @ApiProperty({ example: 'Chương 1: Tổng quan về Hệ thống' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 1, description: 'Thứ tự hiển thị của chương' })
  @IsNumber()
  order: number;

  @ApiProperty({ example: 1, description: 'ID của khóa học (Course) chứa chương này' })
  @IsNumber()
  courseId: number;
}