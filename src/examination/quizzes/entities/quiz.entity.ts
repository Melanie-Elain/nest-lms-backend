import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
// Import từ module questions và submissions
import { Question } from '../../questions/entities/question.entity';
import { Submission } from '../../submissions/entities/submission.entity';

@Entity('quizzes')
export class Quiz {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'time_limit' })
  timeLimit: number; // Đơn vị: Phút

  @Column({ name: 'pass_score', default: 50 })
  passScore: number;

  @Column({ name: 'course_id' })
  courseId: number;

  @Column({ name: 'section_id', nullable: true })
  sectionId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Question, (question) => question.quiz, {
    cascade: true, 
  })
  questions: Question[];

  @OneToMany(() => Submission, (submission) => submission.quiz)
  submissions: Submission[];
}