import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Question } from "./entities/question.entity";
import { Option } from "./entities/option.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Question, Option])],
  })
  export class QuestionsModule {}