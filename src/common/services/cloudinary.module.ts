import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // 1. Import ConfigModule từ NestJS
import { CloudinaryService } from './cloudinary.service';

@Module({
  imports: [ConfigModule], // 2. Thêm vào mảng imports để Service có thể dùng được ConfigService
  providers: [CloudinaryService],
  exports: [CloudinaryService], // 3. Giúp LessonsModule hoặc CourseModule có thể "mượn" dùng chung
})
export class CloudinaryModule {}