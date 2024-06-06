import { ApiPropertyOptional, ApiQuery } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

export class FindKanbanBoardDto {
  @IsInt()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Offset', example: 0 })
  offset: number;

  @IsInt()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Limit', example: 10 })
  limit: number;
}
