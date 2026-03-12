import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from './entities/lesson.entity';
import { CreateLessonDto } from './dto/create-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
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
}