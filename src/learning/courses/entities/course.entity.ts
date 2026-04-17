import { Entity, PrimaryGeneratedColumn, Column, ManyToOne,
 CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../../iam/users/entities/user.entity'; 
@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  thumbnail: string;

  @Column({ default: 0 })
  price: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Một Instructor (User) có thể tạo nhiều Course
  @ManyToOne(() => User, (user) => user.id)
  instructor: User;

  @Column()
  instructorId: number;
}