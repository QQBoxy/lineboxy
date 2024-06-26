import { ApiProperty } from '@nestjs/swagger';
import { instanceToPlain } from 'class-transformer';

import { KanbanListDto } from './kanban-list.dto';

export class ListKanbanListDto {
  @ApiProperty({
    isArray: true,
    type: instanceToPlain(KanbanListDto),
  })
  public data: Array<InstanceType<typeof KanbanListDto>>;

  @ApiProperty({ example: 1 })
  public total: number;
}
