// import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
// import { Lesson } from '../../lessons/entities/lesson.entity'; // Đường dẫn tới file lesson

// @Entity('courses')
// export class Course {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column()
//   title: string;

//   @Column({ nullable: true })
//   description: string;

//   // Quan hệ 1 khóa học - nhiều bài học
//   @OneToMany(() => Lesson, (lesson) => lesson.course)
//   lessons: Lesson[];
// }