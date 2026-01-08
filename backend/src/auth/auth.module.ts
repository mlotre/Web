import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule, // Kullanıcı işlemleri için (AuthService içinde UsersService kullanılıyor)
    PassportModule, // Token doğrulama altyapısı için
    JwtModule.register({
      secret: 'GIZLI_KELIME', // Token oluştururken kullanılan gizli anahtar (jwt.strategy.ts ile aynı olmalı!)
      signOptions: { expiresIn: '1d' }, // Token 1 gün geçerli olsun (1d = 1 day)
    }),
  ],
  controllers: [AuthController], // API endpoint'leri: POST /auth/login, POST /auth/register
  providers: [AuthService, JwtStrategy], // Giriş/kayıt işlemleri ve token doğrulama
})
export class AuthModule {}