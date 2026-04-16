import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from './entities/lesson.entity';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { LessonProgress } from './entities/lesson-progress.entity';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    @InjectRepository(LessonProgress)
    private readonly lessonProgressRepo: Repository<LessonProgress>,
  ) {}

  async create(createLessonDto: CreateLessonDto) {
    // Tạo bản ghi mới dựa trên DTO và lưu vào DB
    const lesson = this.lessonRepository.create(createLessonDto);
    return await this.lessonRepository.save(lesson);
  }

  async findAllBySection(sectionId: number) {
    return await this.lessonRepository.find({
      where: { sectionId },
      order: { order: 'ASC' },
    });
  }

  async findOne(id: number) {
    const lesson = await this.lessonRepository.findOneBy({ id });
    if (!lesson) throw new NotFoundException(`Không tìm thấy bài học có ID ${id}`);
    return lesson;
  }

  async remove(id: number) {
    const lesson = await this.findOne(id);
    return await this.lessonRepository.remove(lesson);
  }

  async update(id: number, updateLessonDto: UpdateLessonDto) {
  const lesson = await this.findOne(id); // Kiểm tra bài học có tồn tại không
  Object.assign(lesson, updateLessonDto); // Ghi đè dữ liệu mới vào bài cũ
  return await this.lessonRepository.save(lesson);
  }

  async updateOrder(id: number, order: number) {
  const lesson = await this.findOne(id);
  lesson.order = order;
  return await this.lessonRepository.save(lesson);
  }

  async markLessonAsCompleted(lessonId: number, userId: number) {
    // 1. Tìm bài học để lấy sectionId
    const lesson = await this.lessonRepository.findOne({ where: { id: lessonId } });
    if (!lesson) {
      throw new NotFoundException('Không tìm thấy bài học này');
    }

    let progress = await this.lessonProgressRepo.findOne({
      where: { lessonId, userId },
    });

    if (!progress) {
      progress = this.lessonProgressRepo.create({
        lessonId,
        userId,
        isCompleted: true,
      });
    } else {
      progress.isCompleted = true;
      progress.completedAt = new Date();
    }
    await this.lessonProgressRepo.save(progress);

    // ==========================================
    // 3. THUẬT TOÁN KIỂM TRA: ĐÃ XEM HẾT CHƯƠNG CHƯA?
    // ==========================================
    const sectionId = lesson.sectionId;

    // Đếm tổng số bài học có trong chương này
    const totalLessons = await this.lessonRepository.count({
      where: { sectionId },
    });

    // Đếm số bài học user ĐÃ HOÀN THÀNH trong chương này
    const completedLessons = await this.lessonProgressRepo.count({
      where: {
        userId,
        isCompleted: true,
        lesson: { sectionId }, // Tận dụng relation cực kỳ tiện lợi
      },
      relations: ['lesson'],
    });

    // So sánh: Nếu bằng nhau nghĩa là đã xem hết mọi Video/Tài liệu trong chương
    const isAllLessonsCompleted = totalLessons > 0 && totalLessons === completedLessons;

    return {
      message: 'Đã lưu tiến độ bài học!',
      progress: {
        completed: completedLessons,
        total: totalLessons,
        isAllLessonsCompleted, // Trả về true/false để Frontend biết đường hiển thị
      },
    };
  }
}