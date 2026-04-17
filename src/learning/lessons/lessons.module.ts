import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express'; // Thêm dòng này
import { memoryStorage } from 'multer'; // Thêm dòng này
import { LessonsController } from './lessons.controller';
import { LessonsService } from './lessons.service';
import { Lesson } from './entities/lesson.entity';
import { CloudinaryModule } from 'src/common/services/cloudinary.module'; 
import { LessonProgress } from './entities/lesson-progress.entity';

@Module({
  imports: [
    // 1. Đăng ký Entity Lesson
    TypeOrmModule.forFeature([Lesson, LessonProgress]), 
    
    // 2. Kết nối với Cloudinary
    CloudinaryModule, 
    
    // 3. Cấu hình Multer để xử lý file (Lưu vào RAM)
    MulterModule.register({
      storage: memoryStorage(),
    }),
  ],
  
  controllers: [LessonsController],
  providers: [LessonsService],
  exports: [LessonsService],
})
export class LessonsModule {}