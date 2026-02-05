import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service'; // 1. Import Service

@ApiTags('Users')
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
  @ApiOperation({ summary: 'Lấy danh sách người dùng' })
  async findAll() {
    // 4. Gọi hàm findAll của Service để lấy dữ liệu thực từ DB
    return await this.usersService.findAll();
  }
}