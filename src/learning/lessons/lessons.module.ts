import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from './entities/lesson.entity';
import { LessonsService } from './lessions.service'
import { LessonsController } from './lessons.controller';
import { LessonProgress } from './entities/lesson-progress.entity';

@Module({
  // 1. Đăng ký Entity Lesson để Repository có thể hoạt động trong Service
  imports: [TypeOrmModule.forFeature([Lesson, LessonProgress])],

  // 2. Khai báo Controller để NestJS lộ trình (route) các API ra Swagger UI
  controllers: [LessonsController],

  // 3. Khai báo Service để xử lý logic nghiệp vụ cho bài học
  providers: [LessonsService],

  // 4. Xuất LessonsService nếu sau này bạn cần dùng ở các module khác 
  // (Ví dụ: Module Progress để theo dõi tiến độ học tập của sinh viên)
  exports: [LessonsService],
})
export class LessonsModule {}