import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { ClassMember } from './entities/class-member.entity';
import { Section } from '../sections/entities/section.entity';
import { SectionProgress } from '../sections/entities/section-progress.entity';
import { BullModule } from '@nestjs/bullmq';
import { Certificate } from './entities/certificate.entity';
import { User } from 'src/iam/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course , ClassMember,Section,SectionProgress, Certificate, User]),
  BullModule.registerQueue({ name: 'email-queue' })],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}