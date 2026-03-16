import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Submission } from './entities/submission.entity';
import { SubmissionAnswer } from './entities/submission-answer.entity';
import { SubmissionsController } from './submissions.controller';
import { SubmissionsService } from './submissions.service';
import { Quiz } from '../quizzes/entities/quiz.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Submission, SubmissionAnswer, Quiz])], 
    controllers: [SubmissionsController], 
    providers: [SubmissionsService],
  })
  export class SubmissionsModule {}
