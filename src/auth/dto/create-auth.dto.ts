import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateAuthDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Redirect URI',
    example: '/login?code=SUCCESSFUL',
  })
  redirect_uri: string;
}
