import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { LessonType } from '../entities/lesson.entity';

export class CreateLessonDto {
  @ApiProperty({ example: 'Bài 1: Cài đặt môi trường' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ enum: LessonType, example: LessonType.VIDEO })
  @IsEnum(LessonType)
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

  @ApiProperty({ example: 1 })
  @IsInt()
  order: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  sectionId: number;
}