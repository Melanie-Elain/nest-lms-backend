import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Question } from "./entities/question.entity";
import { Option } from "./entities/option.entity";
import { QuestionsController } from "./questions.controller";
import { QuestionsService } from "./questions.service";

@Module({
    imports: [TypeOrmModule.forFeature([Question, Option])],
    controllers: [QuestionsController], 
    providers: [QuestionsService],
  })
  export class QuestionsModule {}