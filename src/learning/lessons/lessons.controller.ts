import { Controller, Post, Body, Get, Param, Delete, UseGuards, ParseIntPipe, Patch, BadRequestException, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LessonsService } from './lessions.service'
import { CreateLessonDto } from './dto/create-lesson.dto';
import { JwtAuthGuard } from '../../iam/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../iam/auth/guards/roles.guard';
import { Roles } from '../../iam/auth/decorators/roles.decorator';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UpdateLessonDto } from './dto/update-lesson.dto';

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
@Post('upload')
  @ApiBearerAuth() 
  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles('INSTRUCTOR', 'ADMIN') 
  @ApiOperation({ summary: 'Upload Video hoặc Tài liệu (Chỉ GV/Admin)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(doc|docx|png|pdf|mp4|ppt|pptx)$/)) {
        return cb(new BadRequestException('Định dạng tệp tin không hợp lệ!'), false);
      }
      cb(null, true);
    },
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      success: true,
      url: `http://localhost:3000/uploads/${file.filename}`,
      metadata: {
        originalName: file.originalname,
        mimeType: file.mimetype,      }
    };
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('INSTRUCTOR', 'ADMIN')
  @ApiOperation({ summary: 'Sửa thông tin bài học (Sửa tên, nội dung, loại)' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateLessonDto: UpdateLessonDto) {
    return await this.lessonsService.update(id, updateLessonDto);
  }

  @Patch(':id/reorder')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Chỉ cập nhật nhanh thứ tự vị trí bài học' })
  async reorder(@Param('id', ParseIntPipe) id: number, @Body('order') order: number) {
    return await this.lessonsService.updateOrder(id, order);
  }

  @Post(':id/complete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('STUDENT')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Đánh dấu hoàn thành bài học (Gọi khi xem xong Video/PDF)' })
  completeLesson(@Param('id') lessonId: string, @Req() req: any) {
    // Truyền lessonId và req.user.sub vào Service
    return this.lessonsService.markLessonAsCompleted(+lessonId, req.user.sub);
  }
  
}