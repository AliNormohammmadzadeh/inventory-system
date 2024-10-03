import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ThrottlerGuard } from '@nestjs/throttler';

dotenv.config(); 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, 
      forbidNonWhitelisted: true, 
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(helmet());
  app.enableCors();


  const config = new DocumentBuilder()
    .setTitle('Inventory Management API')
    .setDescription('API documentation for the Inventory Management System')
    .setVersion('1.0')
    .addBearerAuth() 
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); 

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
