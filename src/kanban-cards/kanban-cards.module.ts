import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { KanbanBoard } from '../kanban-boards/entities/kanban-board.entity';
import { KanbanList } from '../kanban-lists/entities/kanban-lists.entity';
import { KanbanCard } from './entities/kanban-card.entity';
import { KanbanCardsController } from './kanban-cards.controller';
import { KanbanCardsService } from './kanban-cards.service';

@Module({
  imports: [TypeOrmModule.forFeature([KanbanCard, KanbanList, KanbanBoard])],
  controllers: [KanbanCardsController],
  providers: [KanbanCardsService],
})
export class KanbanCardsModule {}
