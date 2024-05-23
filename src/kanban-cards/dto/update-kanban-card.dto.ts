import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { KanbanCardDto } from './kanban-card.dto';

export class UpdateKanbanCardDto extends PickType(KanbanCardDto, [
  'title',
  'description',
  'order',
]) {
  @IsOptional()
  @ApiPropertyOptional({ description: 'Kanban Card Title', example: 'My Card' })
  title: string;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Kanban Card Description',
    example: 'My Description',
  })
  description: string;

  @IsOptional()
  @ApiPropertyOptional({ description: 'Kanban Card Order', example: 0 })
  order: number;
}
