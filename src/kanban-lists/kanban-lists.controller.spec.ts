import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { KanbanBoard } from '../kanban-boards/entities/kanban-board.entity';
import { KanbanList } from './entities/kanban-lists.entity';
import { KanbanListsController } from './kanban-lists.controller';
import { KanbanListsService } from './kanban-lists.service';

describe('KanbanListsController', () => {
  let controller: KanbanListsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KanbanListsController],
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

    controller = module.get<KanbanListsController>(KanbanListsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
