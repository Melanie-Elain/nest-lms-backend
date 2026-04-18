import { Controller, Post, Patch, Param, Body, Get, UseGuards, ForbiddenException } from '@nestjs/common';
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

  // @Get('mock-data')
  // @UseGuards(JwtAuthGuard, RolesGuard) // Bật thêm RolesGuard ở đây
  // @Roles('ADMIN') // CHỈ CHO PHÉP ADMIN VÀO
  // @ApiOperation({ summary: 'Lấy dữ liệu giả (Chỉ Admin)' })
  // getMockData() {
    
  //   // BẠN KHÔNG CẦN VIẾT IF NỮA!
  //   // Vì nếu là 'student', cái RolesGuard ở trên đã tự động đá văng 
  //   // và trả về lỗi 403 Forbidden trước khi nó kịp chạy vào hàm này rồi!

  //   const mockDataArray = [
  //     { id: 1, name: 'Dữ liệu giả 1', description: 'Đây là mảng ghi cứng' },
  //     { id: 2, name: 'Dữ liệu giả 2', description: 'Theo đúng yêu cầu của thầy' }
  //   ];

  //   return {
  //     message: 'Lấy dữ liệu thành công!',
  //     data: mockDataArray
  //   };
  // }



  

  // @Get('mock-data')
  // @UseGuards(JwtAuthGuard)
  // @ApiOperation({ summary: 'Lấy dữ liệu giả (Kiểm tra phân quyền)' })
  // getMockData(@ActiveUser() user: any) {
  //   // 1. Kiểm tra Role: Nếu là student thì quăng lỗi 403
  //   // Lưu ý: Đảm bảo field lưu quyền trong token của bạn tên là 'role'. 
  //   // Nếu bạn đang lưu là 'roles' (mảng) thì sửa lại thành user.roles.includes('student') nhé.
  //   if (user.role === 'student') {
  //     throw new ForbiddenException('Bạn không có quyền truy cập dữ liệu này!');
  //   }

  //   // 2. Nếu là admin, tạo mảng dữ liệu cứng (Mock Data)
  //   const mockDataArray = [
  //     { id: 1, name: 'Dữ liệu giả 1', description: 'Đây là mảng ghi cứng' },
  //     { id: 2, name: 'Dữ liệu giả 2', description: 'Theo đúng yêu cầu của thầy' },
  //     { id: 3, name: 'Dữ liệu giả 3', description: 'Trả về status 200 OK tự động' }
  //   ];

  //   // 3. Trả về mảng (tự động nhận HTTP 200 OK)
  //   return {
  //     message: 'Lấy dữ liệu thành công!',
  //     data: mockDataArray
  //   };
  // }
}