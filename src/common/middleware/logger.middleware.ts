import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';

    // Khi có request đến, Middleware sẽ in ra thông tin Method và URL
    this.logger.log(` [Request] ${method} ${originalUrl} - UserAgent: ${userAgent}`);

    // Cho phép request tiếp tục đi đến Controller
    next();
  }
}