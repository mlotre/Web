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
    return this.enrollmentRepository.find({ relations: ['user', 'course'] });
  }

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