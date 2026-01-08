import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories') // /categories route'u için controller
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post() // POST /categories - Yeni kategori oluştur
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get() // GET /categories - Tüm kategorileri getir
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id') // GET /categories/:id - Tek kategori getir
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Patch(':id') // PATCH /categories/:id - Kategori güncelle
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id') // DELETE /categories/:id - Kategori sil
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
