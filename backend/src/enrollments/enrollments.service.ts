import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { Enrollment } from './entities/enrollment.entity';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
  ) {}

  create(createEnrollmentDto: CreateEnrollmentDto) {
    const newEnrollment = this.enrollmentRepository.create({
      user: { id: createEnrollmentDto.userId },
      course: { id: createEnrollmentDto.courseId },
    });
    return this.enrollmentRepository.save(newEnrollment);
  }

  findAll() {
    // Kayıtları getirirken kimin (user) hangi derse (course) kayıt olduğunu da getir
    return this.enrollmentRepository.find({ relations: ['user', 'course'] });
  }

  findOne(id: number) {
    return this.enrollmentRepository.findOne({
      where: { id },
      relations: ['user', 'course'],
    });
  }

  async update(id: number, updateEnrollmentDto: UpdateEnrollmentDto) {
    // Gelen DTO'yu veritabanının anlayacağı şekle çeviriyoruz
    const data: any = {};

    if (updateEnrollmentDto.userId) {
      data.user = { id: updateEnrollmentDto.userId };
    }
    if (updateEnrollmentDto.courseId) {
      data.course = { id: updateEnrollmentDto.courseId };
    }

    // Eğer veri boş değilse güncelleme yap
    if (Object.keys(data).length > 0) {
      return await this.enrollmentRepository.update(id, data);
    }
    return null;
  }

  remove(id: number) {
    return this.enrollmentRepository.delete(id);
  }

  // ÖZEL FONKSİYON: Öğrenci ve Ders ID'sine göre kaydı bulup siler
  async unenroll(userId: number, courseId: number) {
    const enrollment = await this.enrollmentRepository.findOne({
      where: {
        user: { id: userId },
        course: { id: courseId },
      },
    });
    
    if (enrollment) {
      return this.enrollmentRepository.remove(enrollment);
    }
    throw new Error('Kayıt bulunamadı');
  }
}