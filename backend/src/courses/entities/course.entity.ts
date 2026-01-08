import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Enrollment } from '../../enrollments/entities/enrollment.entity';

@Entity()                                     // veritabanına course adında tablo yarat der
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  categoryId: number;

  @ManyToOne(() => Category, (category) => category.courses, { onDelete: 'CASCADE' })
  category: Category;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.course)
  enrollments: Enrollment[];
}