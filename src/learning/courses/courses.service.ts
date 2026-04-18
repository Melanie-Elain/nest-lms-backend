import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { ClassMember } from './entities/class-member.entity'; 
import { SectionProgress } from '../sections/entities/section-progress.entity';
import { Section } from '../sections/entities/section.entity';
import { Certificate } from './entities/certificate.entity';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { User } from 'src/iam/users/entities/user.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,

    @InjectRepository(ClassMember) 
    private readonly classMemberRepository: Repository<ClassMember>,

    @InjectRepository(Section)
    private readonly sectionRepo: Repository<Section>,

    @InjectRepository(SectionProgress)
    private readonly sectionProgressRepo: Repository<SectionProgress>,

    @InjectRepository(Certificate) 
    private readonly certificateRepo: Repository<Certificate>,

    @InjectQueue('email-queue') private readonly emailQueue: Queue,

    @InjectRepository(User) private readonly userRepo: Repository<User>,

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

  // Cập nhật khóa học
  async update(courseId: number, updateCourseDto: any) {
    const course = await this.courseRepository.findOne({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Không tìm thấy khóa học');
    Object.assign(course, updateCourseDto);
    return await this.courseRepository.save(course);
  }

  async remove(courseId: number) {
    const course = await this.courseRepository.findOne({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Không tìm thấy khóa học');
    await this.courseRepository.remove(course);
    return { message: 'Xóa khóa học thành công!' };
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

    async checkFinalExamEligibility(userId: number, courseId: number) {
      // 1. Đếm tổng số chương (Section) của khóa học này
      const totalSections = await this.sectionRepo.count({
        where: { courseId: courseId },
      });
  
      if (totalSections === 0) {
        return { isEligible: false, message: 'Khóa học chưa có nội dung.' };
      }
  
      // 2. Đếm số chương mà học sinh này ĐÃ HOÀN THÀNH (isCompleted = true)
      const completedSections = await this.sectionProgressRepo.count({
        where: {
          userId: userId,
          isCompleted: true,
          section: { courseId: courseId }, // Tận dụng relation join bảng
        },
        relations: ['section'],
      });
  
      // 3. Tính toán tỷ lệ phần trăm
      const progressRatio = completedSections / totalSections;
      const progressPercentage = Math.round(progressRatio * 100);
  
      // 4. Quyết định: Lớn hơn hoặc bằng 80% (0.8) thì cho qua!
      const isEligible = progressRatio >= 0.8;
  
      return {
        isEligible,                     // true/false để Frontend khóa/mở nút bấm
        progressPercentage,             // Trả về số % để FE hiển thị thanh tiến độ (Ví dụ: 85%)
        completedSections,
        totalSections,
        message: isEligible 
          ? 'Đủ điều kiện dự thi Final Exam!' 
          : `Bạn mới hoàn thành ${progressPercentage}%. Cần đạt tối thiểu 80% để làm bài thi cuối khóa.`,
      };
    }


    async evaluateCourseCompletion(userId: number, courseId: number) {
      try {
        console.log(`\n[KIỂM TRA KHÓA HỌC] Đang quét tiến độ khóa học ID: ${courseId} cho User ID: ${userId}...`);
    
        // 1. Đếm tổng số chương (Sections) mà khóa học này có
        const totalSections = await this.sectionRepo.count({
          where: { courseId: courseId }
        });
    
        // 2. Đếm số chương User đã hoàn thành (is_completed = true) thuộc khóa học này
        // Dùng QueryBuilder để đảm bảo map đúng cột 'is_completed' và 'user_id'
        const completedSections = await this.sectionProgressRepo.createQueryBuilder('sp')
          .innerJoin('sp.section', 'section')
          .where('sp.user_id = :userId', { userId })
          .andWhere('sp.is_completed = true')
          .andWhere('section.courseId = :courseId', { courseId })
          .getCount();
    
        console.log(`=> Kết quả: ${completedSections}/${totalSections} chương.`);
    
        // 3. Nếu đã hoàn thành tất cả các chương
        if (totalSections > 0 && completedSections === totalSections) {
          console.log(`🎉 [CHÚC MỪNG] Học viên ${userId} đã hoàn thành 100% khóa học ${courseId}`);
    
          // KIỂM TRA TRÁNH CẤP TRÙNG (Nếu có rồi thì không lưu nữa)
          const existingCert = await this.certificateRepo.findOne({
            where: { userId, courseId }
          });
    
          if (!existingCert) {
            console.log('=> Đang khởi tạo và lưu chứng chỉ mới...');
            
            // Tạo object chứng chỉ mới
            const newCert = this.certificateRepo.create({
              userId: userId,
              courseId: courseId,
              // Lưu ý: Cột pdf_url trong DB của bạn là bắt buộc (Not Null)
              pdfUrl: `https://lms-sgu.vn/view-cert/${userId}-${courseId}`, 
              issuedAt: new Date(),
            });
    
            await this.certificateRepo.save(newCert);
            console.log('✅ ĐÃ GHI CHỨNG CHỈ VÀO DATABASE THÀNH CÔNG!');
    
            // 4. GỬI EMAIL THÔNG BÁO (Nếu User có email)
            const user = await this.userRepo.findOne({ where: { id: userId } });
            if (user && user.email) {
              await this.emailQueue.add('send-certificate', { 
                userId: userId, 
                courseId: courseId,
                email: user.email   
              });
              console.log(`=> Đã đẩy yêu cầu gửi Email tới ${user.email}`);
            }
          } else {
            console.log('⚠️ Chứng chỉ đã tồn tại trong DB, bỏ qua bước lưu.');
          }
          
          return true; 
        }
    
        console.log('❌ Học viên chưa hoàn thành đủ số chương.');
        return false;
    
      } catch (error) {
        // console.error('❌ Lỗi nghiêm trọng khi kiểm tra hoàn thành khóa học:', error.message);
        return false;
      }
    }




}