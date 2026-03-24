import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { Section } from './entities/section.entity';
import { CreateSectionDto } from './dto/create-section.dto';
import { SectionProgress } from './entities/section-progress.entity';
import { LessonProgress } from '../lessons/entities/lesson-progress.entity';
import { Submission } from 'src/examination/submissions/entities/submission.entity';
import { Quiz } from 'src/examination/quizzes/entities/quiz.entity';
import { Lesson } from '../lessons/entities/lesson.entity';

@Injectable()
export class SectionsService {
  constructor(
    @InjectRepository(Section)
    private readonly sectionRepository: Repository<Section>,
    @InjectRepository(SectionProgress) private sectionProgressRepo: Repository<SectionProgress>,
    @InjectRepository(LessonProgress) private lessonProgressRepo: Repository<LessonProgress>,
    @InjectRepository(Submission) private submissionRepo: Repository<Submission>,
    @InjectRepository(Quiz) private quizRepo: Repository<Quiz>,
    @InjectRepository(SectionProgress) private lessonRepo: Repository<Lesson>,

  ) {}

  // Tạo chương học mới
  async create(createSectionDto: CreateSectionDto) {
    const section = this.sectionRepository.create(createSectionDto);
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
    // 1. Kiểm tra điều kiện 1: Đã xem hết Lesson chưa?
    const totalLessons = await this.lessonRepo.count({
      where: { sectionId: sectionId } 
    });
    const completedLessons = await this.lessonProgressRepo.count({
      where: { userId, lesson: { sectionId }, isCompleted: true }
    });
    const isAllLessonsDone = totalLessons > 0 && totalLessons === completedLessons;

    // 2. Kiểm tra điều kiện 2: Đã thi đậu Quiz của Section chưa?
    const sectionQuiz = await this.quizRepo.findOne({ where: { sectionId } });
    let isQuizPassed = false;
    
    if (sectionQuiz) {
      // Tìm xem có bài nộp nào của Quiz này mà Điểm số >= Điểm đỗ (passScore) hay chưa
      const passedSubmission = await this.submissionRepo.findOne({
        where: { 
          userId: userId, 
          quizId: sectionQuiz.id, 
          score: MoreThanOrEqual(sectionQuiz.passScore) // <--- Điểm mấu chốt ở đây!
        }
      });
      isQuizPassed = !!passedSubmission; // Ép kiểu về boolean
    } else {
      isQuizPassed = true; // Nếu chương này không có Quiz thì mặc định qua môn
    }

    // 3. Tự động chốt sổ nếu thỏa cả 2 điều kiện!
    if (isAllLessonsDone && isQuizPassed) {
      let sectionProgress = await this.sectionProgressRepo.findOne({
        where: { userId, sectionId }
      });

      if (!sectionProgress) {
        // Chưa có thì tạo mới
        await this.sectionProgressRepo.save(
          this.sectionProgressRepo.create({ userId, sectionId, isCompleted: true })
        );
      } else if (!sectionProgress.isCompleted) {
        // Có rồi nhưng chưa complete thì update
        sectionProgress.isCompleted = true;
        sectionProgress.completedAt = new Date();
        await this.sectionProgressRepo.save(sectionProgress);
      }
    }
  }
}