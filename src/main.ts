import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { AppModule } from './module/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors();
  app.setGlobalPrefix('api');
  await app.listen(5000);
}
bootstrap();
