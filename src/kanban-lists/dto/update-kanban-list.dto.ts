import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { KanbanListDto } from './kanban-list.dto';

export class UpdateKanbanListsDto extends PickType(KanbanListDto, ['name', 'order']) {
  @IsOptional()
  @ApiPropertyOptional({ description: 'Kanban Lists Name', example: 'Todo' })
  name: string;

  @IsOptional()
  @ApiPropertyOptional({ description: 'Kanban Lists Order', example: 0 })
  order: number;
}
