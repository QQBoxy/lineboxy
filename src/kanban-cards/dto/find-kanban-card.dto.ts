import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class FindKanbanCardDto {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ description: 'Kanban List ID', example: 1 })
  listId: number;

  @IsInt()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Offset', example: 0 })
  offset: number;

  @IsInt()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Limit', example: 10 })
  limit: number;
}
