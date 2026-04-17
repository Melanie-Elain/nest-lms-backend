import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { Section } from './entities/section.entity';
import { CreateSectionDto } from './dto/create-section.dto';
import { SectionProgress } from './entities/section-progress.entity';
import { LessonProgress } from '../lessons/entities/lesson-progress.entity';
import { Submission } from 'src/examination/submissions/entities/submission.entity';
import { Quiz } from 'src/examination/quizzes/entities/quiz.entity';
import { Lesson } from '../lessons/entities/lesson.entity';
import { CoursesService } from '../courses/courses.service';
import { CreateLessonDto } from '../lessons/dto/create-lesson.dto';

@Injectable()
export class SectionsService {
  constructor(
    @InjectRepository(Section)
    private readonly sectionRepository: Repository<Section>,
    @InjectRepository(SectionProgress) private sectionProgressRepo: Repository<SectionProgress>,
    @InjectRepository(LessonProgress) private lessonProgressRepo: Repository<LessonProgress>,
    @InjectRepository(Submission) private submissionRepo: Repository<Submission>,
    @InjectRepository(Quiz) private quizRepo: Repository<Quiz>,
    @InjectRepository(Lesson) private lessonRepo: Repository<Lesson>,
    private readonly coursesService: CoursesService,
  ) {}

  
  // Tạo chương học mới
async create(createSectionDto: CreateSectionDto) {
  const { courseId, title } = createSectionDto;

  // 1. Lấy số thứ tự lớn nhất hiện có của khóa học này
  const lastSection = await this.sectionRepository.findOne({
    where: { course: { id: courseId } },
    order: { order: 'DESC' },
  });

  // 2. Tự động tính toán số order tiếp theo
  const nextOrder = lastSection ? lastSection.order + 1 : 1;

  // 3. Tự động định dạng lại tiêu đề: "Chương X: Tên chương"
  const formattedTitle = `Chương ${nextOrder}: ${title}`;

  // 4. Lưu vào Database
  const section = this.sectionRepository.create({
    title: formattedTitle,
    order: nextOrder,
    course: { id: courseId },
  });

  return await this.sectionRepository.save(section);
}

  // Lấy danh sách chương của một khóa học, kèm theo các bài học bên trong
  async findAllByCourse(courseId: number) {
    return await this.sectionRepository.find({
      where: { courseId },
      order: { order: 'ASC' },
      relations: ['lessons'], // Tự động lấy các Lesson thuộc về Section này
    });
  }

  // Xóa chương học
  async remove(id: number) {
    const section = await this.sectionRepository.findOneBy({ id });
    if (!section) throw new NotFoundException('Không tìm thấy chương này');
    return await this.sectionRepository.remove(section);
  }

  async evaluateSectionCompletion(userId: number, sectionId: number) {
    console.log('------------------------------------------------');
    console.log(`[BẮT ĐẦU CHECK] Section: ${sectionId} | User: ${userId}`);
  
    // 1. Đếm tổng số bài học trong section (dùng relation cho chắc)
    const query = this.lessonRepo
      .createQueryBuilder('lesson')
      .innerJoin('lesson.section', 'section')
      .where('section.id = :sectionId', { sectionId });

    // 👉 DEBUG SQL ở đây
    console.log('SQL totalLessons:', query.getSql());

    // 👉 rồi mới execute
    const totalLessons = await query.getCount();
  
    // 2. Đếm số bài đã hoàn thành
    const completedCount = await this.lessonProgressRepo
      .createQueryBuilder('lp')
      .innerJoin('lp.lesson', 'lesson')
      .innerJoin('lesson.section', 'section')
      .where('lp.user_id = :userId', { userId })
      .andWhere('lp.is_completed = true')
      .andWhere('section.id = :sectionId', { sectionId })
      .getCount();
  
    console.log(`=> Kết quả chuẩn: Tổng ${totalLessons} bài | Đã học xong ${completedCount} bài`);
  
    // 3. Kiểm tra Quiz
    const sectionQuiz = await this.quizRepo.findOne({
      where: { sectionId }
    });
  
    let isQuizPassed = false;
  
    if (sectionQuiz) {
      const passedSubmission = await this.submissionRepo.findOne({
        where: {
          userId,
          quizId: sectionQuiz.id,
          score: MoreThanOrEqual(sectionQuiz.passScore)
        }
      });
      isQuizPassed = !!passedSubmission;
    } else {
      // Không có quiz => auto pass
      isQuizPassed = true;
    }
  
    console.log(`=> Quiz Status: ${isQuizPassed ? 'ĐẬU' : 'RỚT/CHƯA THI'}`);
  
    // 4. Kiểm tra điều kiện hoàn thành section
    const isAllLessonsDone = totalLessons > 0 && totalLessons === completedCount;
  
    if (isAllLessonsDone && isQuizPassed) {
      console.log('=> ĐỦ ĐIỀU KIỆN! TIẾN HÀNH LƯU...');
  
      // Check đã tồn tại chưa (tránh duplicate)
      const existing = await this.sectionProgressRepo.findOne({
        where: { userId, sectionId }
      });
  
      if (!existing) {
        const newProgress = this.sectionProgressRepo.create({
          userId,
          sectionId,
          isCompleted: true,
          completedAt: new Date(),
        });
  
        const saved = await this.sectionProgressRepo.save(newProgress);
        console.log('=> ĐÃ LƯU THÀNH CÔNG! ID:', saved.id);
        const currentSection = await this.sectionRepository.findOne({ 
          where: { id: sectionId },
          select: ['id', 'courseId'] 
      });

      // 2. Bắn tín hiệu sang CoursesService để nó kiểm tra tổng thể
      if (currentSection && currentSection.courseId) {
          await this.coursesService.evaluateCourseCompletion(userId, currentSection.courseId);
      }
      } else {
        console.log('=> ĐÃ HOÀN THÀNH TRƯỚC ĐÓ (không tạo lại)');
      }
  
    } else {
      console.log('=> KHÔNG ĐỦ ĐIỀU KIỆN:', {
        isAllLessonsDone,
        isQuizPassed
      });
    }
  
    console.log('------------------------------------------------');
  }
}