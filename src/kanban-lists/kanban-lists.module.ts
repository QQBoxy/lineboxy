import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { KanbanBoard } from '../kanban-boards/entities/kanban-board.entity';
import { KanbanList } from './entities/kanban-lists.entity';
import { KanbanListsController } from './kanban-lists.controller';
import { KanbanListsService } from './kanban-lists.service';

@Module({
  imports: [TypeOrmModule.forFeature([KanbanList, KanbanBoard])],
  controllers: [KanbanListsController],
  providers: [KanbanListsService],
})
export class KanbanListsModule {}
