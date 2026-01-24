import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './iam/auth/auth.module';
import { UsersModule } from './iam/users/users.module';
import { CoursesModule } from './learning/courses/courses.module';
import { LessonsModule } from './learning/lessons/lessons.module';
import { EnrollmentsModule } from './learning/enrollments/enrollments.module';
import { QuizzesModule } from './examination/quizzes/quizzes.module';
import { SubmissionsModule } from './examination/submissions/submissions.module';

@Module({
  imports: [AuthModule, UsersModule, CoursesModule, LessonsModule, EnrollmentsModule, QuizzesModule, SubmissionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
