import { ApiProperty } from '@nestjs/swagger';
import { instanceToPlain } from 'class-transformer';

import { KanbanCardDto } from './kanban-card.dto';

export class ListKanbanCardDto {
  @ApiProperty({
    isArray: true,
    type: KanbanCardDto,
    enumName: 'KanbanCardDto',
  })
  public data: Array<KanbanCardDto>;

  @ApiProperty({ example: 1 })
  public total: number;
}
