import { Controller, Post, Body, Get, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LessonsService } from './lessions.service'
import { CreateLessonDto } from './dto/create-lesson.dto';
import { JwtAuthGuard } from '../../iam/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../iam/auth/guards/roles.guard';
import { Roles } from '../../iam/auth/decorators/roles.decorator';

@ApiTags('Lessons')
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  // Tạo bài học mới (Chỉ dành cho Giảng viên và Admin)
  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('INSTRUCTOR', 'ADMIN')
  @ApiOperation({ summary: 'Tạo bài học mới (Chỉ GV/Admin)' })
  async create(@Body() createLessonDto: CreateLessonDto) {
    return await this.lessonsService.create(createLessonDto);
  }

  // Lấy danh sách bài học theo chương (Công khai)
  @Get('section/:sectionId')
  @ApiOperation({ summary: 'Lấy danh sách bài học theo ID chương (Công khai)' })
  async findAllBySection(@Param('sectionId', ParseIntPipe) sectionId: number) {
    return await this.lessonsService.findAllBySection(sectionId);
  }

  // Xem chi tiết một bài học (Công khai)
  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết bài học (Công khai)' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.lessonsService.findOne(id);
  }

  // Xóa bài học (Chỉ GV/Admin)
  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('INSTRUCTOR', 'ADMIN')
  @ApiOperation({ summary: 'Xóa bài học (Chỉ GV/Admin)' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.lessonsService.remove(id);
  }
}