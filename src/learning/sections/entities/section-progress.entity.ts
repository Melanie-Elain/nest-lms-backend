import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Section } from '../../sections/entities/section.entity';

@Entity('section_progress')
export class SectionProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number; // Lưu req.user.sub

  @Column({ name: 'section_id' })
  sectionId: number;

  @Column({ name: 'is_completed', default: false })
  isCompleted: boolean;

  @CreateDateColumn({ name: 'completed_at' })
  completedAt: Date;

  // Quan hệ N-1 với Section
  @ManyToOne(() => Section, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'section_id' })
  section: Section;
}