import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, MinLength } from 'class-validator';

export class UpdateCourseDto {
    @ApiProperty({
    example: 'Lập trình NestJS cơ bản',
    description: 'Tên khóa học',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  title?: string;

    @ApiProperty({  
    example: 'Khóa học dành cho người mới bắt đầu',
    description: 'Mô tả khóa học',
    required: false,    
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({
    example: 199000,
    description: 'Giá khóa học',   
    required: false,
    })
    @IsOptional()
    price?: number; 

    @ApiProperty({
    example: 'https://image.com/thumb.png',
    description: 'Ảnh đại diện khóa học',   
    required: false,
    })
    @IsOptional()       
    @IsString()
    @IsUrl()
    thumbnail?: string;

}