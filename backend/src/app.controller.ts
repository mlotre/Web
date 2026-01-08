import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller() // Ana route (/) için controller
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get() // GET http://localhost:3000/
  getHello(): string {
    return this.appService.getHello();
  }
}
