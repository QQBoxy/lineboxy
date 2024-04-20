import { ApiProperty } from '@nestjs/swagger';
import { KanbanBoardDto } from './kanban-board.dto';
import { instanceToPlain } from 'class-transformer';

export class ListKanbanBoardDto {
  @ApiProperty({ example: 1 })
  public total: number;

  @ApiProperty({
    isArray: true,
    type: instanceToPlain(KanbanBoardDto),
  })
  public data: Array<InstanceType<typeof KanbanBoardDto>>;
}
