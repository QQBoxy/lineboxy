import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KanbanBoardsService } from './kanban-boards.service';
import { KanbanBoardsController } from './kanban-boards.controller';
import { KanbanBoard } from './entities/kanban-board.entity';

@Module({
  imports: [TypeOrmModule.forFeature([KanbanBoard])],
  controllers: [KanbanBoardsController],
  providers: [KanbanBoardsService],
  exports: [KanbanBoardsService],
})
export class KanbanBoardsModule {}
