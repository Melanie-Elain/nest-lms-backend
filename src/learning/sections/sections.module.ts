import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Section } from './entities/section.entity';
import { SectionsService } from './sections.service';
import { SectionsController } from './sections.controller';
import { SectionProgress } from './entities/section-progress.entity';
import { LessonProgress } from '../lessons/entities/lesson-progress.entity';
import { Quiz } from 'src/examination/quizzes/entities/quiz.entity';
import { Submission } from 'src/examination/submissions/entities/submission.entity';
import { Lesson } from '../lessons/entities/lesson.entity';
import { CoursesModule } from '../courses/courses.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([
      Section, 
      SectionProgress, 
      LessonProgress, 
      Quiz, 
      Submission, 
      Lesson
    ]), 

    CoursesModule 
  ],
  providers: [SectionsService],
  exports: [SectionsService],
})
export class SectionsModule {}


