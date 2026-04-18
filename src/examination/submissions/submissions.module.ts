import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Submission } from './entities/submission.entity';
import { SubmissionAnswer } from './entities/submission-answer.entity';
import { SubmissionsController } from './submissions.controller';
import { SubmissionsService } from './submissions.service';
import { Quiz } from '../quizzes/entities/quiz.entity';
import { BullModule } from '@nestjs/bullmq';
import { EmailProcessor } from './email.processor';
import { User } from 'src/iam/users/entities/user.entity';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { SectionsModule } from 'src/learning/sections/sections.module';
import { LessonProgress } from 'src/learning/lessons/entities/lesson-progress.entity';
import { Lesson } from 'src/learning/lessons/entities/lesson.entity';
import { ClassMember } from 'src/learning/courses/entities/class-member.entity';


@Module({
    imports: [TypeOrmModule.forFeature([Submission, SubmissionAnswer, Quiz, User, Lesson, LessonProgress, ClassMember]),
      SectionsModule,
      BullModule.registerQueue({
        name: 'email-queue',
      }),
      BullBoardModule.forFeature({
        name: 'email-queue',
        adapter: BullMQAdapter, 
      }),
    ], 
    controllers: [SubmissionsController], 
    providers: [
      SubmissionsService,
      EmailProcessor],
  })
  export class SubmissionsModule {}
