import { Controller, Post, Body, UseGuards, Headers, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Đăng nhập vào hệ thống' })
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Làm mới token' })
  async refresh(@Body('refreshToken') token: string) {
    return this.authService.refreshToken(token);
  }

  @Post('change-password')
  @ApiOperation({ summary: 'Thay đổi mật khẩu' })
  @UseGuards(JwtAuthGuard)
  async changePassword(@ActiveUser('sub') userId: number, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(userId, dto);
  }

 @Post('logout')
  @ApiOperation({ summary: 'Đăng xuất khỏi hệ thống' })
  @UseGuards(JwtAuthGuard)
  async logout(@Headers('authorization') authHeader: string) {
    if (!authHeader) throw new UnauthorizedException('Missing Authorization Header');
    const token = authHeader.split(' ')[1];
    return this.authService.logout(token);
  }

}