import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { KanbanList } from '../kanban-lists/entities/kanban-lists.entity';
import { KanbanCard } from './entities/kanban-card.entity';
import { KanbanCardsController } from './kanban-cards.controller';
import { KanbanCardsService } from './kanban-cards.service';

describe('KanbanCardsController', () => {
  let controller: KanbanCardsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KanbanCardsController],
      providers: [
        KanbanCardsService,
        {
          provide: getRepositoryToken(KanbanCard),
          useValue: {}, // Mock repository
        },
        {
          provide: getRepositoryToken(KanbanList),
          useValue: {}, // Mock repository
        },
      ],
    }).compile();

    controller = module.get<KanbanCardsController>(KanbanCardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
