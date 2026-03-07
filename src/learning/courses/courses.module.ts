import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { ClassMember } from './entities/class-member.entity';

@Module({
  // 1. Đăng ký Entity Course để Repository có thể hoạt động
  imports: [TypeOrmModule.forFeature([Course , ClassMember])],
  
  // 2. Khai báo Controller để nhận API
  controllers: [CoursesController],
  
  // 3. Khai báo Service để xử lý logic
  providers: [CoursesService],
  
  // 4. Xuất Service ra để các Module khác (như Quizzes của SV3) có thể dùng chung
  exports: [CoursesService],
})
export class CoursesModule {}