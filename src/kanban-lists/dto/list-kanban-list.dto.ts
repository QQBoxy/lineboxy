import { ApiProperty } from '@nestjs/swagger';

import { KanbanListDto } from './kanban-list.dto';

export class ListKanbanListDto {
  @ApiProperty({
    isArray: true,
    type: KanbanListDto,
    enumName: 'KanbanListDto',
  })
  public data: Array<KanbanListDto>;

  @ApiProperty({ example: 1 })
  public total: number;
}
