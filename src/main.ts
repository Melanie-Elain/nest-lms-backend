import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // Dòng này sửa lỗi ValidationPipe
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'; // Dòng này sửa lỗi Swagger

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cấu hình Validation toàn cục
  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true, 
    transform: true,
    forbidNonWhitelisted: true, 
  }));

  // Cấu hình Swagger
  const config = new DocumentBuilder()
    .setTitle('S-Link API Documentation')
    .setDescription('Hệ thống quản lý học tập và thi cử trực tuyến')
    .setVersion('1.0')
    .addBearerAuth() 
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: http://localhost:3000/api`);
}
bootstrap();