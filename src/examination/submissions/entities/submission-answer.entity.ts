import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Submission } from './submission.entity';
// Import Question và Option để tham chiếu
import { Question } from '../../questions/entities/question.entity';
import { Option } from '../../questions/entities/option.entity';

@Entity('submission_answers')
export class SubmissionAnswer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'submission_id' })
  submissionId: number;

  @Column({ name: 'question_id' })
  questionId: number;

  @Column({ name: 'selected_option_id' })
  selectedOptionId: number;

  @ManyToOne(() => Submission, (submission) => submission.answers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'submission_id' })
  submission: Submission;

  @ManyToOne(() => Question)
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @ManyToOne(() => Option)
  @JoinColumn({ name: 'selected_option_id' })
  selectedOption: Option;
}