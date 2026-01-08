import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { User } from './users/entities/user.entity';
import { Category } from './categories/entities/category.entity';
import { Course } from './courses/entities/course.entity';
import { Enrollment } from './enrollments/entities/enrollment.entity';

import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { CoursesModule } from './courses/courses.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { AuthModule } from './auth/auth.module';

@Module({ // Ana modül - tüm modülleri bir araya getirir
  imports: [
    TypeOrmModule.forRoot({ // Veritabanı ayarları
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [User, Category, Course, Enrollment], // Veritabanı tabloları
      synchronize: true, // Kod değişince tabloları otomatik güncelle
    }),

    UsersModule,
    CategoriesModule,
    CoursesModule,
    EnrollmentsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}