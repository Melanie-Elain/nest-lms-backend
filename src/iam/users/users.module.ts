import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity'; // Import Entity vừa tạo

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Đăng ký Entity ở đây
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Export để các module khác (như Learning) có thể dùng
})
export class UsersModule {}