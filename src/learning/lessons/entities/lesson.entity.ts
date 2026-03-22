import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Section } from '../../sections/entities/section.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum LessonType {
  VIDEO = 'video',
  PDF = 'pdf',
  PPTX = 'pptx',
  DOCX = 'docx'
}

@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'enum', enum: LessonType, default: LessonType.VIDEO })
  type: LessonType;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'integer', nullable: true })
  duration: number;

  @Column({ type: 'integer', default: 0 })
  order: number;

  // Quan hệ N-1 với Section
  @ManyToOne(() => Section, (section) => section.lessons, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'section_id' })
  section: Section;

  @Column({ name: 'section_id' })
  sectionId: number;
}