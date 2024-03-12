import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: "*",
  });
  const log = await app.listen(process.env.PORT)
  console.log(process.env.PORT);
  
  // .then((path)=>{console.log("server is running on : "+"http://localhost:"+process.env.PORT)});
}
bootstrap();
