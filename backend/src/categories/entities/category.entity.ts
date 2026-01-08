import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Course } from '../../courses/entities/course.entity';

@Entity() // Veritabanında 'category' tablosu oluşturur
export class Category {
  @PrimaryGeneratedColumn() // Otomatik artan ID (Primary Key)
  id: number;

  @Column() // Kategori adı (örn: "Programlama", "Matematik")
  name: string;

  @OneToMany(() => Course, (course) => course.category, { cascade: true, onDelete: 'CASCADE' }) // Bire-Çok İlişki: Bir kategoride birden çok ders olabilir
  courses: Course[]; // Bu kategorideki tüm dersler (Kategori silinince dersler de silinir)
}