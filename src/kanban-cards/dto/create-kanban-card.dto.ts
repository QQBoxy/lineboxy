import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

import { KanbanCardDto } from './kanban-card.dto';

export class CreateKanbanCardDto extends PickType(KanbanCardDto, [
  'title',
  'description',
]) {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ description: 'Kanban List ID', example: 1 })
  listId: number;
}
