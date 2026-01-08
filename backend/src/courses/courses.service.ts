import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}

  create(createCourseDto: CreateCourseDto) {
    // Kategori ilişkisini ID üzerinden kuruyoruz
    const newCourse = this.courseRepository.create({
      ...createCourseDto,
      category: { id: createCourseDto.categoryId },
    });
    return this.courseRepository.save(newCourse);
  }

  findAll() {
    // Dersleri çekerken kategorisini de getir (relations)
    return this.courseRepository.find({ relations: ['category'] });
  }

  findOne(id: number) {
    return this.courseRepository.findOne({
      where: { id },
      relations: ['category'],
    });
  }

  update(id: number, updateCourseDto: UpdateCourseDto) {
    return this.courseRepository.update(id, updateCourseDto);
  }

  remove(id: number) {
    return this.courseRepository.delete(id);
  }
}