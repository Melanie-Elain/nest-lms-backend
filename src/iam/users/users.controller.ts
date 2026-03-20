import { Controller, Post, Patch, Param, Body, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service'; 
import { RolesGuard } from '../auth/guards/roles.guard';     
import { Roles } from '../auth/decorators/roles.decorator';
import { ActiveUser } from '../../common/decorators/active-user.decorator'; 
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
 

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @ApiOperation({ summary: 'Đăng ký tài khoản' })
  async create(@Body() createUserDto: CreateUserDto) {
    const result = await this.usersService.create(createUserDto);
    return {
      message: 'Đăng ký thành công và đã lưu vào DB!',
      data: result,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN') 
  @ApiOperation({ summary: 'Lấy danh sách người dùng (Chỉ ADMIN)' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lấy thông tin cá nhân của người đang đăng nhập' })
  getProfile(@ActiveUser() user: any) {
    return {
      message: 'Đây là thông tin cá nhân của bạn',
      user: user, 
    };
  }

  @Patch('profile')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cập nhật thông tin cá nhân' })
  async updateProfile(@ActiveUser('sub') userId: number, @Body() updateDto: UpdateProfileDto) {
    return this.usersService.updateProfile(userId, updateDto);
  }

  @Patch(':id/status')
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Thay đổi trạng thái người dùng(Chỉ ADMIN)' })
  async changeStatus(@Param('id') id: number, @Body() dto: UpdateStatusDto) {
    return this.usersService.updateStatus(id, dto.is_active);
  }
}