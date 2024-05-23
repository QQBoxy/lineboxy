import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class KanbanCardDto {
  @IsInt()
  @ApiProperty({ description: 'Kanban Card ID', example: 1 })
  id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Kanban Card Title', example: 'My Card' })
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Kanban Card Description', example: 'My Description' })
  description: string;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ description: 'Kanban Card Order', example: 0 })
  order: number;

  @ApiProperty({ example: '2024-03-31T11:15:12.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-03-31T11:15:12.000Z' })
  updatedAt: Date;
}
