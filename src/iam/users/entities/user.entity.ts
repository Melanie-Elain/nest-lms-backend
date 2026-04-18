import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users') // Tên bảng trong SQL của bạn
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ select: false}) // select: false để bảo mật, không hiện password khi lấy data
  password: string;

  @Column({ name: 'full_name', nullable: true })
  full_name: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({
    type: 'enum',
    enum: ['ADMIN', 'INSTRUCTOR', 'STUDENT','CONTENT_MODERATOR'],
    default: 'STUDENT',
  })
  role: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // @Column({ name: 'full_name', nullable: true })
  // full_name: string;
}