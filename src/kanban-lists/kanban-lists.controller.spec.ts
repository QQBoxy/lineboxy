import { Test, TestingModule } from '@nestjs/testing';

import { KanbanListsController } from './kanban-lists.controller';
import { KanbanListsService } from './kanban-lists.service';

describe('KanbanListsController', () => {
  let controller: KanbanListsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KanbanListsController],
      providers: [KanbanListsService],
    }).compile();

    controller = module.get<KanbanListsController>(KanbanListsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
