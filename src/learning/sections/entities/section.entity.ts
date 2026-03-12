import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Course } from '../../courses/entities/course.entity'; 
import { Lesson } from '../../lessons/entities/lesson.entity'; // Chú ý: Lesson viết hoa

@Entity('sections')
export class Section {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ default: 0 })
  order: number;

  @Column()
  courseId: number;

  @ManyToOne(() => Course, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'courseId' })
  course: Course;

  // Sửa chỗ này: Tham chiếu đúng Class Lesson
  @OneToMany(() => Lesson, (lesson) => lesson.section)
  lessons: Lesson[]; 
}