import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth') // /auth route'u için controller
export class AuthController {
  constructor(
    private readonly authService: AuthService, // Giriş işlemleri için
    private readonly usersService: UsersService, // Kayıt işlemleri için
  ) {}

  @Post('login') // POST /auth/login - Giriş yap
  async login(@Body() body) { // Frontend'den email ve password al
    const user = await this.authService.validateUser(body.email, body.password); // Email ve şifre doğru mu kontrol et
    if (!user) { // Yanlışsa hata fırlat
      throw new UnauthorizedException('Hatalı email veya şifre');
    }
    return this.authService.login(user); // Doğruysa token oluştur ve döndür
  }

  @Post('register') // POST /auth/register - Kayıt ol
  async register(@Body() createUserDto: CreateUserDto) { // Frontend'den kullanıcı bilgilerini al
    return this.usersService.create(createUserDto); // Yeni kullanıcı oluştur ve veritabanına kaydet
  }
}