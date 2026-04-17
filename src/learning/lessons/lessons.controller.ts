
import { 
  Controller, Post, Body, Get, Param, Delete, 
  UseGuards, ParseIntPipe, Patch, BadRequestException,
  UseInterceptors, UploadedFile 
} from '@nestjs/common';
import { 
  ApiTags, ApiOperation, ApiBearerAuth, 
  ApiConsumes, ApiBody 
} from '@nestjs/swagger';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { JwtAuthGuard } from '../../iam/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../iam/auth/guards/roles.guard';
import { Roles } from '../../iam/auth/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/common/services/cloudinary.service';

@ApiTags('Lessons')
@Controller('lessons')
export class LessonsController {
  constructor(
    private readonly lessonsService: LessonsService, 
    private readonly cloudinaryService: CloudinaryService
  ) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('INSTRUCTOR', 'ADMIN')
  @ApiOperation({ summary: 'Tạo bài học mới (Chỉ GV/Admin)' })
  async create(@Body() createLessonDto: CreateLessonDto) {
    return await this.lessonsService.create(createLessonDto);
  }

  @Get('section/:sectionId')
  @ApiOperation({ summary: 'Lấy danh sách bài học theo ID chương (Công khai)' })
  async findAllBySection(@Param('sectionId', ParseIntPipe) sectionId: number) {
    return await this.lessonsService.findAllBySection(sectionId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết bài học (Công khai)' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.lessonsService.findOne(id);
  }

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
  @ApiOperation({ summary: 'Upload Video/Tài liệu lên Cloudinary (Chỉ GV/Admin)' })
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
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(doc|docx|png|pdf|mp4|ppt|pptx)$/)) {
        return cb(new BadRequestException('Định dạng tệp tin không hợp lệ!'), false);
      }
      cb(null, true);
    },
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Vui lòng chọn tệp tin để tải lên!');
    }
    const fileUrl = await this.cloudinaryService.uploadFile(file);
    return {
      success: true,
      message: 'Tải lên thành công!',
      url: fileUrl,
      metadata: {
        name: file.originalname,
        type: file.mimetype,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
      }
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