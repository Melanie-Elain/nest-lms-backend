import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SubmissionAnswer } from './submission-answer.entity';
import { Quiz } from '../../quizzes/entities/quiz.entity';
// QUAN TRỌNG: Kiểm tra kỹ đường dẫn tới User Entity của bạn
import { User } from '../../../iam/users/entities/user.entity';

@Entity('submissions')
export class Submission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'quiz_id' })
  quizId: number;

  // Kiểu decimal cho điểm số lẻ (ví dụ 8.5)
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  score: number;

  @Column({ name: 'started_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  startedAt: Date;

  @Column({ name: 'completed_at', type: 'timestamptz', nullable: true })
  completedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Quiz, (quiz) => quiz.submissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quiz_id' })
  quiz: Quiz;

  @OneToMany(() => SubmissionAnswer, (answer) => answer.submission, { cascade: true })
  answers: SubmissionAnswer[];
}