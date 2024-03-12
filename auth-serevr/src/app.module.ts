import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from "@nestjs/config";
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/environment/${process.env.NODE_ENV}.env`,
    }),
  ],
  controllers: [AppController],
  providers: [AppService,JwtService],
})
export class AppModule {}
