import { Controller, Post, Body, UseGuards, Headers, UnauthorizedException, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshTokenDto } from './dto/refresh-token.dto';

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
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto.refreshToken);
  }

  @Post('change-password')
  @ApiOperation({ summary: 'Thay đổi mật khẩu' })
  @UseGuards(JwtAuthGuard)
  async changePassword(@ActiveUser('sub') userId: number, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(userId, dto);
  }

//  @Post('logout')
//   @ApiOperation({ summary: 'Đăng xuất khỏi hệ thống' })
//   @UseGuards(JwtAuthGuard)
//   async logout(authHeader: string) {
//     if (!authHeader) throw new UnauthorizedException('Missing Authorization Header');
//     const token = authHeader.split(' ')[1];
//     return this.authService.logout(token);
//   }

  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Đăng xuất khỏi hệ thống' })
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: any) {
    // JwtAuthGuard đã kiểm tra và xử lý token, ta chỉ cần lấy nó ra
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new UnauthorizedException('Không tìm thấy Token');
    const token = authHeader.split(' ')[1];
    return this.authService.logout(token);
  }

}