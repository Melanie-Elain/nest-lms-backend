import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Section } from './entities/section.entity';
import { CreateSectionDto } from './dto/create-section.dto';

@Injectable()
export class SectionsService {
  constructor(
    @InjectRepository(Section)
    private readonly sectionRepository: Repository<Section>,
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
}