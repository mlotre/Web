import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Global validation pipe - tüm DTO'ları otomatik validate eder
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // DTO'da olmayan alanları otomatik sil
    forbidNonWhitelisted: true, // DTO'da olmayan alan gönderilirse hata ver
    transform: true, // Gelen veriyi otomatik dönüştür
  }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
