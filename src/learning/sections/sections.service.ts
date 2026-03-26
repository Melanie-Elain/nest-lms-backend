import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Section } from './entities/section.entity';
import { CreateSectionDto } from './dto/create-section.dto';
import { CreateLessonDto } from '../lessons/dto/create-lesson.dto';
import { Lesson } from '../lessons/entities/lesson.entity';

@Injectable()
export class SectionsService {
  constructor(
    @InjectRepository(Section)
    private readonly sectionRepository: Repository<Section>,
    
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
}