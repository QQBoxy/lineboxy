import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateIotDto {
  @IsString()
  @ApiPropertyOptional({ description: 'Message', example: '1' })
  message: string;
}
