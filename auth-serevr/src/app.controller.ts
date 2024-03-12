import { Controller, Get, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get("auth/token")
  async generateToken(@Req() req: any) {
    return await this.appService.generateToken(req);
  }
  @Get("auth/url")
  async generateUrl() {
    return await this.appService.generateUrl();
  }
  @Get("dashboard")
  async dashboard(@Req() req: any) {
    return this.appService.login(req);
  }
}
