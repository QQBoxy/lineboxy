import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

import { KanbanListDto } from './kanban-list.dto';

export class CreateKanbanListDto extends PickType(KanbanListDto, ['name']) {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ description: 'Kanban Board ID', example: 1 })
  boardId: number;
}
