import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service'; 


@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  // 2. Khai báo Service trong constructor
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @ApiOperation({ summary: 'Đăng ký tài khoản' })
  async create(@Body() createUserDto: CreateUserDto) {
    // 3. Gọi hàm create của Service (hàm này đã có lệnh lưu DB ở bước trước)
    const result = await this.usersService.create(createUserDto);
    return {
      message: 'Đăng ký thành công và đã lưu vào DB!',
      data: result,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard) // <--- Thêm dòng này để khóa API lại
  @ApiOperation({ summary: 'Lấy danh sách người dùng' })
  findAll() {
  return this.usersService.findAll();
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getProfile(@Req() req) {
    // Thông tin user nằm trong req.user do JwtAuthGuard gán vào
    return {
      message: 'Đây là thông tin của bạn bóc tách từ Token',
      user: req.user, 
    };
  }
  
}