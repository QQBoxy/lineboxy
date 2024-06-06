import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class FindKanbanListDto {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ description: 'Kanban Board ID', example: 1 })
  boardId: number;

  @IsInt()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Offset', example: 0 })
  offset: number;

  @IsInt()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Limit', example: 10 })
  limit: number;
}
