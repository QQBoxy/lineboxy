import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class KanbanListsDto {
  @IsInt()
  @ApiProperty({ description: 'Kanban Lists ID', example: 1 })
  id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Kanban Lists Name', example: 'Todo' })
  name: string;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ description: 'Kanban Lists Order', example: 0 })
  order: number;

  @ApiProperty({ example: '2024-03-31T11:15:12.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-03-31T11:15:12.000Z' })
  updatedAt: Date;
}
