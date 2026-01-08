import { IsEmail, IsNotEmpty, MinLength, IsIn, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Email boş olamaz' })
  @IsEmail({}, { message: 'Geçerli bir email adresi giriniz' })
  email: string;

  @IsNotEmpty({ message: 'Şifre boş olamaz' })
  @MinLength(6, { message: 'Şifre en az 6 karakter olmalıdır' })
  password: string;

  @IsOptional()
  fullName?: string;

  @IsNotEmpty({ message: 'Rol seçilmelidir' })
  @IsIn(['student', 'admin'], { message: 'Rol sadece student veya admin olabilir' })
  role: string;
}