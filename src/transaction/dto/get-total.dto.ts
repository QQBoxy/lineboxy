import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class GetTotalDto {
  @IsInt()
  @Min(1970)
  @Max(3000)
  @IsOptional()
  @ApiPropertyOptional({ description: 'Year', example: 2026 })
  year?: number;
}
