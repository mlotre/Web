import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService, // Kullanıcı işlemleri için
    private jwtService: JwtService, // Token oluşturmak için
  ) {}

  async validateUser(email: string, pass: string): Promise<any> { // Email ve şifre doğru mu kontrol et
    const user = await this.usersService.findByEmail(email); // Email'e göre kullanıcıyı bul
    if (user && user.password === pass) { // Kullanıcı var ve şifre doğru mu?
      const { password, ...result } = user; // Şifreyi çıkar (güvenlik için frontend'e gönderme)
      return result; // Kullanıcı bilgisini döndür (şifre olmadan)
    }
    return null; // Hatalıysa null döndür
  }

  async login(user: any) { // Token oluştur ve kullanıcıya ver
    const payload = { email: user.email, sub: user.id, role: user.role }; // Token içine konulacak bilgiler
    return {
      access_token: this.jwtService.sign(payload), // JWT token oluştur
      user: user, // Kullanıcı bilgisini de döndür (Frontend'de lazım)
    };
  }
}