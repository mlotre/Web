import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Enrollment } from '../../enrollments/entities/enrollment.entity';

@Entity() // Veritabanında 'user' tablosu oluşturur
export class User {
  @PrimaryGeneratedColumn() // Otomatik artan ID (1, 2, 3...)
  id: number;

  @Column({ unique: true }) // Benzersiz email (aynısından iki tane olamaz)
  email: string;

  @Column() // Şifre (hash'lenmiş halde saklanır)
  password: string;

  @Column({ default: 'student' }) // Rol: 'student' (öğrenci) veya 'admin' (öğretmen)
  role: string;

  @Column({ nullable: true }) // İsim soyisim (zorunlu değil)
  fullName: string;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.user) // Bir kullanıcının birden çok ders kaydı olabilir
  enrollments: Enrollment[];
}