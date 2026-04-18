import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateCourseDto {
  @ApiProperty({ 
    example: 'Khóa học NestJS Thực chiến', 
    description: 'Tên khóa học',
    required: false 
  })
  @IsOptional()
  @IsString({ message: 'Tên khóa học phải là một chuỗi văn bản' })
  title?: string;

  @ApiProperty({ 
    example: 'Hướng dẫn xây dựng hệ thống LMS từ A-Z', 
    description: 'Mô tả chi tiết khóa học',
    required: false 
  })
  @IsOptional()
  @IsString()
  description?: string;

  // ĐÃ THÊM THUMBNAIL VÀO ĐÂY:
  @ApiProperty({ 
    example: 'https://example.com/image.png', 
    description: 'Đường dẫn ảnh bìa khóa học',
    required: false 
  })
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiProperty({ 
    example: 500000, 
    description: 'Giá tiền khóa học (VNĐ)',
    required: false 
  })
  @IsOptional()
  @IsNumber({}, { message: 'Giá tiền phải là một con số' })
  price?: number;
}