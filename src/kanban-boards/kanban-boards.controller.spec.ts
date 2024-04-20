import { Test, TestingModule } from '@nestjs/testing';

import { KanbanBoardsController } from './kanban-boards.controller';
import { KanbanBoardsService } from './kanban-boards.service';

describe('KanbanBoardsController', () => {
  let controller: KanbanBoardsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KanbanBoardsController],
      providers: [KanbanBoardsService],
    }).compile();

    controller = module.get<KanbanBoardsController>(KanbanBoardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
