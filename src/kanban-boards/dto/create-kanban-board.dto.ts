import { PickType } from '@nestjs/swagger';
import { KanbanBoardDto } from './kanban-board.dto';

export class CreateKanbanBoardDto extends PickType(KanbanBoardDto, ['name']) {}
