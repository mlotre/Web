import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Token'ı Authorization header'ından al (Bearer token)
      ignoreExpiration: false, // Token süresi dolmuşsa hata ver
      secretOrKey: 'GIZLI_KELIME', // Token doğrulama için gizli anahtar (auth.module.ts ile aynı olmalı)
    });
  }

  async validate(payload: any) { // Token geçerliyse bu fonksiyon çalışır
    return { userId: payload.sub, email: payload.email, role: payload.role }; // Token içindeki bilgileri isteğe ekle
  }
}