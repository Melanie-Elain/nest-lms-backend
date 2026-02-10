import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Submission } from './entities/submission.entity';
import { SubmissionAnswer } from './entities/submission-answer.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Submission, SubmissionAnswer])], 
  })
  export class SubmissionsModule {}
