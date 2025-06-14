import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { KanbanBoard } from '../kanban-boards/entities/kanban-board.entity';
import { KanbanList } from './entities/kanban-lists.entity';
import { KanbanListsService } from './kanban-lists.service';

describe('KanbanListsService', () => {
  let service: KanbanListsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KanbanListsService,
        {
          provide: getRepositoryToken(KanbanList),
          useValue: {}, // Mock repository
        },
        {
          provide: getRepositoryToken(KanbanBoard),
          useValue: {}, // Mock repository
        },
      ],
    }).compile();

    service = module.get<KanbanListsService>(KanbanListsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
