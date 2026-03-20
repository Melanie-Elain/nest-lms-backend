import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService, 
    @Inject(CACHE_MANAGER) private cacheManager: Cache, // Tiêm CacheManager để dùng Redis
  ) {}

  // Hàm bổ trợ để tạo bộ đôi Token (Dùng cho cả Login và Refresh)
    async generateTokens(user: any) {
      const payload = { 
        sub: user.id, 
        email: user.email, 
        role: user.role,
        name: user.fullName 
      };

      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(payload, { expiresIn: '15m' }), // Access Token ngắn hạn
        this.jwtService.signAsync(payload, { expiresIn: '7d' }),  // Refresh Token dài hạn
      ]);

      return { accessToken, refreshToken };
    }

    async login(loginDto: any) {
        const user = await this.usersService.findOneByEmail(loginDto.email);
        if (!user) throw new UnauthorizedException('Email không tồn tại trong hệ thống');

        const isMatch = await bcrypt.compare(loginDto.password, user.password);
        if (!isMatch) throw new UnauthorizedException('Mật khẩu không chính xác');

       const tokens = await this.generateTokens(user);  

          return {
        message: 'Đăng nhập thành công',
        ...tokens,
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      };
    }


    // Chức năng Refresh Token
    async refreshToken(token: string) {
      try {
        const payload = await this.jwtService.verifyAsync(token);
        const user = await this.usersService.findOne(payload.sub);
        
        if (!user || !user.isActive) {
          throw new UnauthorizedException('Tài khoản không hợp lệ');
        }

        return this.generateTokens(user);
      } catch {
        throw new UnauthorizedException('Refresh Token không hợp lệ hoặc đã hết hạn');
      }
    }

    // Chức năng Logout sử dụng Redis Blacklist
    async logout(token: string) {
      await this.cacheManager.set(`blacklist_${token}`, true, 3600);

      return { 
        message: 'Đăng xuất thành công',
        status: 'success'
      };
    }

    // Chức năng thay đổi mật khẩu
    async changePassword(userId: number, dto: ChangePasswordDto) {
      const user = await this.usersService.findOne(userId); 

      const isMatch = await bcrypt.compare(dto.oldPassword, user.password);
      if (!isMatch) throw new UnauthorizedException('Mật khẩu cũ không chính xác');

      const hashedNewPassword = await bcrypt.hash(dto.newPassword, 10);
      
      return this.usersService.update(userId, { password: hashedNewPassword });
    }
    

}