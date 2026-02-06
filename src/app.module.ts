import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './iam/users/users.module';
import { AuthModule } from './iam/auth/auth.module';

@Module({
  imports: [
    // 1. Đọc file .env
    ConfigModule.forRoot({ isGlobal: true }),

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
        synchronize: true, // Đã bật lên true để tự tạo bảng từ Entity
      }),
    }),

    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}