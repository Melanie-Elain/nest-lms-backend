import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({
    example: 'Nguyen Van A',
    description: 'Họ và tên người dùng',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  fullName?: string;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'Đường dẫn ảnh đại diện',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  avatar?: string;
}