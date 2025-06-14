import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { User } from '../users/entities/user.entity';
import { KanbanBoard } from './entities/kanban-board.entity';
import { KanbanBoardsService } from './kanban-boards.service';

describe('KanbanBoardsService', () => {
  let service: KanbanBoardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KanbanBoardsService,
        {
          provide: getRepositoryToken(KanbanBoard),
          useValue: {}, // Mock repository
        },
        {
          provide: getRepositoryToken(User),
          useValue: {}, // Mock repository
        },
      ],
    }).compile();

    service = module.get<KanbanBoardsService>(KanbanBoardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
