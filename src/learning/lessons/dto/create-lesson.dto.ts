import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { LessonType } from '../entities/lesson.entity';

export class CreateLessonDto {
  @ApiProperty({ 
    example: 'Cài đặt môi trường Lab', 
    description: 'Chỉ cần nhập tên bài, hệ thống sẽ tự thêm tiền tố "Bài X:"' 
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ 
    enum: LessonType, 
    example: LessonType.VIDEO,
    description: 'Loại bài học: video, pdf, pptx, docx'
  })
  @IsEnum(LessonType)
  @IsNotEmpty()
  type: LessonType;

  @ApiProperty({ example: 'https://youtube.com/...', required: false })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ example: 'Mô tả ngắn về bài học', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 300, description: 'Thời lượng tính bằng giây', required: false })
  @IsOptional()
  @IsInt()
  duration?: number;

  @ApiProperty({ 
    example: 1, 
    required: false, 
    description: 'Thứ tự bài học (Hệ thống sẽ tự động tính toán, không cần nhập)' 
  })
  

  @ApiProperty({ 
    example: 1, 
    description: 'ID của Chương (Section) chứa bài học này' 
  })
  @IsInt()
  @IsNotEmpty()
  sectionId: number;
}