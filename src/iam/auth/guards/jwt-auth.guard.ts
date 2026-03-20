import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache, // Tiêm CacheManager để check Redis
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Bạn cần đăng nhập để thực hiện hành động này');
    }

    // --- BƯỚC MỚI: Kiểm tra Blacklist trong Redis ---
    const isBlacklisted = await this.cacheManager.get(`blacklist_${token}`);
    if (isBlacklisted) {
      throw new UnauthorizedException('Phiên đăng nhập đã kết thúc, vui lòng đăng nhập lại');
    }
    // -----------------------------------------------

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'CHUNG_SINH_BINH_DANG', 
      });
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Thẻ thông hành không hợp lệ hoặc đã hết hạn');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}