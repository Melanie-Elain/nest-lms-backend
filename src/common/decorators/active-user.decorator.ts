import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ActiveUser = createParamDecorator(
  (field: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user; // Dữ liệu này do JwtAuthGuard gán vào

    // Nếu truyền vào @ActiveUser('email') thì chỉ lấy email
    return field ? user?.[field] : user;
  },
);