import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express'; // Quan trọng
import { join } from 'path'; // Quan trọng
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  // 1. Sửa dòng này để NestJS hiểu đây là ứng dụng Express (để dùng Static Assets)
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 2. Cấu hình để truy cập file (Video/PDF) từ thư mục 'uploads'
  // Khi đó link sẽ có dạng: http://localhost:3000/uploads/ten-file.pdf
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

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

  app.useGlobalInterceptors(new TransformInterceptor());

  // Cho phép gọi API từ các nguồn khác (nếu sau này Hồng làm Frontend)
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: http://localhost:3000/api`);
  console.log(`Static files are served at: http://localhost:3000/uploads/`);
}

bootstrap();