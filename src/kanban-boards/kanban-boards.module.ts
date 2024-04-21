import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../users/entities/user.entity';
import { KanbanBoard } from './entities/kanban-board.entity';
import { KanbanBoardsController } from './kanban-boards.controller';
import { KanbanBoardsService } from './kanban-boards.service';

@Module({
  imports: [TypeOrmModule.forFeature([KanbanBoard, User])],
  controllers: [KanbanBoardsController],
  providers: [KanbanBoardsService],
  exports: [KanbanBoardsService],
})
export class KanbanBoardsModule {}
