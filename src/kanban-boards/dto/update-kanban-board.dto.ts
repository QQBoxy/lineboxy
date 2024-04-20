import { PickType } from '@nestjs/swagger';
import { KanbanBoardDto } from './kanban-board.dto';

export class UpdateKanbanBoardDto extends PickType(KanbanBoardDto, ['name']) {}
