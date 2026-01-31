import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('Users') // BẮT BUỘC: Để nhóm các API lại
@Controller('users')
export class UsersController {

  @Post('register')
  @ApiOperation({ summary: 'Đăng ký tài khoản' }) // Mô tả cho API
  create(@Body() createUserDto: CreateUserDto) {
    return { message: 'Đăng ký thành công', data: createUserDto };
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách người dùng' })
  findAll() {
    return [];
  }
}