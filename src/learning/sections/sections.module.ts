import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Section } from './entities/section.entity';
import { SectionsService } from './sections.service';
import { SectionsController } from './sections.controller';
import { SectionProgress } from './entities/section-progress.entity';
import { LessonProgress } from '../lessons/entities/lesson-progress.entity';
import { Quiz } from 'src/examination/quizzes/entities/quiz.entity';
import { Submission } from 'src/examination/submissions/entities/submission.entity';
import { Lesson } from '../lessons/entities/lesson.entity';

@Module({
  // 1. Đăng ký Entity Section vào TypeORM
  imports: [TypeOrmModule.forFeature([Section, SectionProgress, LessonProgress, Quiz, Submission, Lesson])],

  // 2. Khai báo Controller để các endpoint của Section hiện lên Swagger
  controllers: [SectionsController],

  // 3. Khai báo Service để xử lý logic (tạo chương, lấy chương theo khóa học)
  providers: [SectionsService],

  // 4. Xuất SectionsService ra 
  // (Rất quan trọng vì Lesson thường cần kiểm tra xem Section có tồn tại không)
  exports: [SectionsService],
})
export class SectionsModule {}