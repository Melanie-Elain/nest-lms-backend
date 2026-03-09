import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from './entities/quiz.entity';
import { QuizzesController } from './quizzes.controller';
import { QuizzesService } from './quizzes.service';
import { Submission } from '../submissions/entities/submission.entity';
import { SubmissionAnswer } from '../submissions/entities/submission-answer.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Quiz, Submission, SubmissionAnswer])],
    controllers: [QuizzesController], 
    providers: [QuizzesService],
    exports: [TypeOrmModule] 
  })
  export class QuizzesModule {}
