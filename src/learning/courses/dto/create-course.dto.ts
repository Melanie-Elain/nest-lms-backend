import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({ example: 'Lập trình NestJS cơ bản' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Khóa học dành cho người mới bắt đầu', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 199000, default: 0 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 'https://image.com/thumb.png', required: false })
  @IsOptional()
  @IsString()
  thumbnail?: string;
}