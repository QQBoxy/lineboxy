import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class FindKanbanListDto {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ description: 'Kanban Board ID', example: 1 })
  boardId: number;

  @IsInt()
  @IsOptional()
  @ApiProperty({ description: 'Offset', example: 0 })
  offset: number;

  @IsInt()
  @IsOptional()
  @ApiProperty({ description: 'Limit', example: 10 })
  limit: number;
}
