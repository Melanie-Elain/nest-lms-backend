import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from './entities/lesson.entity';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
  ) {}

 async create(createLessonDto: CreateLessonDto) {
  const { sectionId, ...lessonData } = createLessonDto;

  // 1. Tìm bài học cuối cùng trong chương (Section) này
  const lastLesson = await this.lessonRepository.findOne({
    where: { section: { id: sectionId } },
    order: { order: 'DESC' },
  });

  // 2. Tính toán số thứ tự tiếp theo
  const nextOrder = lastLesson ? lastLesson.order + 1 : 1;

  // 3. Khởi tạo thực thể mới với đầy đủ thông tin (bao gồm cả quan hệ section)
  const lesson = this.lessonRepository.create({
    ...lessonData,
    order: nextOrder,
    section: { id: sectionId } // Gán quan hệ để TypeORM tự hiểu khóa ngoại
  });

  // 4. Lưu vào Database
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
}