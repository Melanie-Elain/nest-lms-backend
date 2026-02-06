import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'sinhvien@gmail.com', description: 'Email của người dùng' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456', description: 'Mật khẩu ít nhất 6 ký tự' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Nguyen Van A', required: false })
  @IsString()
  fullName?: string;

  @ApiProperty({ 
    example: 'STUDENT', 
    enum: ['STUDENT', 'INSTRUCTOR', 'ADMIN'],
    required: false 
  })
  @IsOptional()
  @IsEnum(['STUDENT', 'INSTRUCTOR', 'ADMIN'])
  role?: string;
}