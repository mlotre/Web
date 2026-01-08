import { IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  categoryId: number;
}