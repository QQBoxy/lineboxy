import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { KanbanListsDto } from './kanban-lists.dto';

export class UpdateKanbanListsDto extends PickType(KanbanListsDto, ['name', 'order']) {
  @IsOptional()
  @ApiPropertyOptional({ description: 'Kanban Lists Name', example: 'Todo' })
  name: string;

  @IsOptional()
  @ApiPropertyOptional({ description: 'Kanban Lists Order', example: 0 })
  order: number;
}
