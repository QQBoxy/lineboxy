import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { User } from '../users/entities/user.entity';
import { KanbanBoard } from './entities/kanban-board.entity';
import { KanbanBoardsController } from './kanban-boards.controller';
import { KanbanBoardsService } from './kanban-boards.service';

describe('KanbanBoardsController', () => {
  let controller: KanbanBoardsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KanbanBoardsController],
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

    controller = module.get<KanbanBoardsController>(KanbanBoardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
