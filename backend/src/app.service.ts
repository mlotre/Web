import { Injectable } from '@nestjs/common';

@Injectable() // Bu class başka yerlere enjekte edilebilir
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
