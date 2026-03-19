import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ example: 'chuoi_token_o_day' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}