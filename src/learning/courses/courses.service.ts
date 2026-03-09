import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { ClassMember } from './entities/class-member.entity'; 

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,

    @InjectRepository(ClassMember) 
    private readonly classMemberRepository: Repository<ClassMember>,
  ) {}

// Tạo khóa học mới
  async create(createCourseDto: CreateCourseDto, instructorId: number) {
    const course = this.courseRepository.create({
      ...createCourseDto,
      instructorId,
    });
    return await this.courseRepository.save(course);
  }

//   Lấy danh sách khóa học
  async findAll() {
    return await this.courseRepository.find({
      relations: ['instructor'], // Để lấy luôn thông tin người tạo
    });
  }

// Xem chi tiết khóa học
  async findOne(id: number) {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['instructor'],
    });
    if (!course) throw new NotFoundException('Không tìm thấy khóa học');
    return course;
  }

//   Đăng ký tham gia khóa học
    async enroll(courseId: number, userId: number) {
    // 1. Kiểm tra đã ghi danh chưa
    const existing = await this.classMemberRepository.findOne({
        where: { course_id: courseId, user_id: userId }
    });

    if (existing) {
        return { message: 'Bạn đã tham gia khóa học này rồi' };
    }

    // 2. Nếu chưa thì tạo mới
    const enrollment = this.classMemberRepository.create({
        course_id: courseId,
        user_id: userId
    });
    
    await this.classMemberRepository.save(enrollment);
    return { message: 'Ghi danh thành công!' };
    }

// Lấy danh sách thành viên của một khóa học
   async findMembersByCourse(courseId: number) {
    // 1. Lấy thông tin khóa học và Giảng viên
    const course = await this.courseRepository.findOne({
        where: { id: courseId },
        relations: ['instructor'],
    });

    if (!course) throw new NotFoundException('Không tìm thấy khóa học');

    // 2. Lấy danh sách thành viên và JOIN với thông tin User
    const members = await this.classMemberRepository.find({
        where: { course_id: courseId },
        relations: ['user'],
        select: {
        user: {
            id: true,
            email: true,
            full_name: true, // Lấy đúng trường này từ Database của bạn
        }
        }
    });

    // 3. Xử lý logic thông báo
    if (members.length === 0) {
        return {
        courseTitle: course.title,
        instructorName: course.instructor?.full_name || course.instructor?.email,
        message: 'Lớp học hiện tại chưa có thành viên nào tham gia.',
        data: []
        };
    }

    return {
        courseTitle: course.title,
        instructorName: course.instructor?.full_name || course.instructor?.email,
        totalMembers: members.length,
        data: members.map(m => ({
        studentId: m.user.id,
        studentName: m.user.full_name, // Hiển thị tên đầy đủ của sinh viên
        studentEmail: m.user.email,
        joinedAt: m.joinedAt
        }))
    };
    }
}