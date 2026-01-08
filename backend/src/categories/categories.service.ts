import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { Course } from '../courses/entities/course.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) // Category tablosuyla çalışmak için repository enjekte et
    private categoryRepository: Repository<Category>,
    @InjectRepository(Course) // Course tablosuyla çalışmak için repository enjekte et
    private courseRepository: Repository<Course>,
  ) {}

  create(createCategoryDto: CreateCategoryDto) { // Yeni kategori oluştur
    const newCategory = this.categoryRepository.create(createCategoryDto); // DTO'dan entity oluştur
    return this.categoryRepository.save(newCategory); // Veritabanına kaydet
  }

  findAll() { // Tüm kategorileri getir
    return this.categoryRepository.find(); // SQL: SELECT * FROM category
  }

  findOne(id: number) { // ID'ye göre kategori getir
    return this.categoryRepository.findOneBy({ id }); // SQL: SELECT * FROM category WHERE id = ?
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) { // Kategori güncelle
    return this.categoryRepository.update(id, updateCategoryDto); // SQL: UPDATE category SET ... WHERE id = ?
  }

  async remove(id: number) { // Kategori sil
    // Önce bu kategoriye ait dersleri sil
    await this.courseRepository.delete({ categoryId: id });
    // Sonra kategoriyi sil
    return this.categoryRepository.delete(id);
  }
}