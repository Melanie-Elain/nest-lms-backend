import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('certificates') 
export class Certificate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'course_id' })
  courseId: number;

  @Column({ name: 'pdf_url', type: 'text' })
  pdfUrl: string;

  @CreateDateColumn({ name: 'issued_at', type: 'timestamp with time zone' })
  issuedAt: Date;
}