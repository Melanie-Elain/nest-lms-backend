import { Module } from "@nestjs/common";
import { QuizzesModule } from "./quizzes/quizzes.module";
import { QuestionsModule } from "./questions/questions.module";
import { SubmissionsModule } from "./submissions/submissions.module";

@Module({
    imports: [
      QuizzesModule,
      QuestionsModule,
      SubmissionsModule
    ]
  })
  export class ExaminationModule {}