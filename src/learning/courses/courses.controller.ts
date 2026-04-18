import { Controller, Post, Body, Get, Param, UseGuards, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { JwtAuthGuard } from '../../iam/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../iam/auth/guards/roles.guard';
import { Roles } from '../../iam/auth/decorators/roles.decorator';
import { ActiveUser } from '../../common/decorators/active-user.decorator';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {

  constructor(private readonly coursesService: CoursesService) {}
  
// Tạo khóa học mới (Chỉ giảng viên và Admin mới được tạo)
  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('INSTRUCTOR', 'ADMIN') // Chỉ giảng viên và Admin mới được tạo
  @ApiOperation({ summary: 'Tạo khóa học mới(Chỉ giảng viên và Admin mới được tạo)' })
  async create(
    @Body() createCourseDto: CreateCourseDto,
    @ActiveUser('sub') userId: number, // Lấy ID người đang đăng nhập làm giảng viên
  ) {
    return await this.coursesService.create(createCourseDto, userId);
  }

//   Lấy danh sách khóa học (Công khai)
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách khóa học (Công khai)' })
  async findAll() {
    return await this.coursesService.findAll();
  }

//   Xem chi tiết khóa học (Công khai)
  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết khóa học (Công khai) ' })
  async findOne(@Param('id') id: number) {
    return await this.coursesService.findOne(id);
  }

//   Đăng ký tham gia khóa học (Chỉ cần đăng nhập, không cần phân quyền)
  @Post(':id/enroll')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard) // Chỉ cần đăng nhập là được học, không cần phân quyền ADMIN
    @ApiOperation({ summary: 'Đăng ký tham gia khóa học' })
    async enroll(
    @Param('id') courseId: number, 
    @ActiveUser('sub') userId: number // Tuyệt chiêu của SV1 đây!
    ) {
    return await this.coursesService.enroll(courseId, userId);
    }

    // Chỉ giảng viên hoặc Admin mới được xem danh sách sinh viên đã tham gia khóa học
    @Get(':id/members')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('INSTRUCTOR', 'ADMIN')
    @ApiOperation({ summary: 'Lấy danh sách sinh viên đã tham gia khóa học (Chỉ GV/Admin)' })
    async getMembers(@Param('id') courseId: number) {
    return await this.coursesService.findMembersByCourse(courseId);
    }

     // Cập nhật khóa học (Chỉ giảng viên,admin và role mới đã thêm ở role.enum.ts CONTENT_MODERATOR = 'CONTENT_MODERATOR', )
    @Patch(':id/update')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('INSTRUCTOR', 'ADMIN', 'CONTENT_MODERATOR')
    @ApiOperation({ summary: 'Cập nhật khóa học (Chỉ giảng viên, admin và content moderator)' })
    async update(
      @Param('id') courseId: number,
      @Body() updateCourseDto: any
    ) {
      return await this.coursesService.update(courseId, updateCourseDto);
    }

    @Delete(':id/delete')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('INSTRUCTOR', 'ADMIN')
    @ApiOperation({ summary: 'Xóa khóa học (Chỉ giảng viên, admin' })
    async remove(@Param('id') courseId: number) {
      return await this.coursesService.remove(courseId);
    }
}