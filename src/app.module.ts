import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './iam/users/users.module';
import { AuthModule } from './iam/auth/auth.module';
import { ExaminationModule } from './examination/examination.module';
import { CoursesModule } from './learning/courses/courses.module';
import { SectionsModule } from './learning/sections/sections.module';
import { LessonsModule } from './learning/lessons/lessons.module';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';
import { BullModule } from '@nestjs/bullmq';
import { MailerModule } from '@nestjs-modules/mailer';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';

@Module({
  imports: [
    // 1. Đọc file .env
    ConfigModule.forRoot({ isGlobal: true }),
    BullBoardModule.forRoot({
      route: '/admin/queues', // Đường dẫn để vào trang Dashboard
      adapter: ExpressAdapter, // NestJS mặc định dùng Express dưới nền
    }),
    // 2. Kết nối Postgres (Dùng forRootAsync để đọc được biến môi trường)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USERNAME', 'postgres'),
        password: config.get<string>('DB_PASSWORD'), 
        database: config.get<string>('DB_NAME', 'nest_lms_db'),
        autoLoadEntities: true, 
        synchronize: true, 
      }),
    }),

    CacheModule.registerAsync({
      isGlobal: true, 
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        store: createKeyv(config.get<string>('REDIS_URL', 'redis://localhost:6379')),
        ttl: 60000, 
      }),
    }),

    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        connection: {
          // Lấy link Redis, BullMQ cần tách riêng host và port
          host: config.get<string>('REDIS_HOST', 'localhost'),
          port: config.get<number>('REDIS_PORT', 6379),
        },
      }),
    }),

    // THÊM CẤU HÌNH GỬI EMAIL:
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 587,
          secure: false, 
          auth: {
            // Thay bằng email thật của bạn
            user: config.get<string>('MAIL_USER', 'email_cua_ban@gmail.com'), 
            // Thay bằng MẬT KHẨU ỨNG DỤNG 16 KÝ TỰ lấy ở Bước 1 (Ví dụ: 'abcdefghijklmnop')
            pass: config.get<string>('MAIL_PASS', 'mat_khau_ung_dung_16_ky_tu'), 
          },
        },
        defaults: {
          // Tên người gửi hiển thị trong hộp thư đến
          from: '"Hệ thống LMS NestJS" <noreply@lms.com>', 
        },
      }),
    }),

    UsersModule,
    AuthModule,
    ExaminationModule,
    CoursesModule,
    SectionsModule,
    LessonsModule
  ],
})
export class AppModule {}