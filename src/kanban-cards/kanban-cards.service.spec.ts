import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { KanbanList } from '../kanban-lists/entities/kanban-lists.entity';
import { KanbanCard } from './entities/kanban-card.entity';
import { KanbanCardsService } from './kanban-cards.service';

describe('KanbanCardsService', () => {
  let service: KanbanCardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<KanbanCardsService>(KanbanCardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
