import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Option } from './option.entity';
// Import Quiz từ module bên cạnh (lùi ra 2 cấp thư mục)
import { Quiz } from '../../quizzes/entities/quiz.entity';

export enum QuestionType {
  SINGLE = 'SINGLE',
  MULTIPLE = 'MULTIPLE',
}

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: 1 })
  points: number;

  @Column({
    type: 'enum',
    enum: QuestionType,
    default: QuestionType.SINGLE,
  })
  type: QuestionType;

  @ManyToOne(() => Quiz, (quiz) => quiz.questions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quiz_id' })
  quiz: Quiz;

  @OneToMany(() => Option, (option) => option.question, { cascade: true })
  options: Option[];
}