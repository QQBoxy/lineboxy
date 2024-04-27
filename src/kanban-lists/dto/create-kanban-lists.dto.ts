import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

import { KanbanListsDto } from './kanban-lists.dto';

export class CreateKanbanListsDto extends PickType(KanbanListsDto, ['name']) {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ description: 'Kanban Board ID', example: 1 })
  boardId: number;
}
