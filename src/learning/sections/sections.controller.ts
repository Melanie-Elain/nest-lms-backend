import { Controller, Get, Post, Body, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SectionsService } from './sections.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { JwtAuthGuard } from '../../iam/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../iam/auth/guards/roles.guard';
import { Roles } from '../../iam/auth/decorators/roles.decorator';

@ApiTags('Sections')
@Controller('sections')
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('INSTRUCTOR', 'ADMIN')
  @ApiOperation({ summary: 'Tạo chương học mới (Chỉ GV/Admin)' })
  async create(@Body() createSectionDto: CreateSectionDto) {
    return await this.sectionsService.create(createSectionDto);
  }

  @Get('course/:courseId')
  @ApiOperation({ summary: 'Lấy danh sách chương theo ID khóa học (Công khai)' })
  async findAllByCourse(@Param('courseId', ParseIntPipe) courseId: number) {
    return await this.sectionsService.findAllByCourse(courseId);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('INSTRUCTOR', 'ADMIN')
  @ApiOperation({ summary: 'Xóa chương học (Chỉ GV/Admin)' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.sectionsService.remove(id);
  }
}