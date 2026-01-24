import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // Đọc file .env
    ConfigModule.forRoot({ isGlobal: true }),

    // Kết nối Postgres
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USERNAME', 'postgres'),
        password: config.get<string>('DB_PASSWORD'), // Password bạn đặt lúc cài Postgres
        database: config.get<string>('DB_NAME', 'nest_lms_db'),
        autoLoadEntities: true, 
        synchronize: false, // Để false vì bạn đã có file SQL, tránh NestJS làm hỏng cấu trúc bảng
      }),
    }),
  ],
})
export class AppModule {}