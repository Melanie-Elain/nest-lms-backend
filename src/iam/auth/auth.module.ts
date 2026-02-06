import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { RolesGuard } from './guards/roles.guard';  

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true, // Để các module khác (SV2, SV3) cũng dùng được
      secret: 'CHUNG_SINH_BINH_DANG', // Sau này nên để trong file .env
      signOptions: { expiresIn: '1d' }, // Token có hạn trong 1 ngày
    }),
  ],
  providers: [AuthService, RolesGuard],
  controllers: [AuthController]
})
export class AuthModule {}
