import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsNotEmpty } from 'class-validator';

export class KanbanBoardDto {
  @IsInt()
  @ApiProperty({ description: 'Kanban Board ID', example: 1 })
  id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Kanban Board Name', example: 'Todo' })
  name: string;

  @ApiProperty({ example: '2024-03-31T11:15:12.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-03-31T11:15:12.000Z' })
  updatedAt: Date;
}
