import { ApiProperty } from '@nestjs/swagger';
import { instanceToPlain } from 'class-transformer';

import { KanbanListsDto } from './kanban-lists.dto';

export class ListKanbanListDto {
  @ApiProperty({
    isArray: true,
    type: instanceToPlain(KanbanListsDto),
  })
  public data: Array<InstanceType<typeof KanbanListsDto>>;

  @ApiProperty({ example: 1 })
  public total: number;
}
