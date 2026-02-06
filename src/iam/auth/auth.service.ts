import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService, 
  ) {}

    async login(loginDto: any) {
        const user = await this.usersService.findOneByEmail(loginDto.email);
        if (!user) throw new UnauthorizedException('Email không tồn tại trong hệ thống');

        const isMatch = await bcrypt.compare(loginDto.password, user.password);
        if (!isMatch) throw new UnauthorizedException('Mật khẩu không chính xác');

        // 1. Tạo Payload (Thông tin muốn giấu trong Token)
        const payload = { 
        sub: user.id, 
        email: user.email, 
        role: user.role 
        };

        // 2. Ký tên và tạo Token
        return {
        message: 'Đăng nhập thành công',
        access_token: await this.jwtService.signAsync(payload),
        user: {
            id: user.id,
            email: user.email,
            role: user.role
            }
        };
    }
}