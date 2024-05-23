import { Test, TestingModule } from '@nestjs/testing';

import { KanbanCardsController } from './kanban-cards.controller';
import { KanbanCardsService } from './kanban-cards.service';

describe('KanbanCardsController', () => {
  let controller: KanbanCardsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KanbanCardsController],
      providers: [KanbanCardsService],
    }).compile();

    controller = module.get<KanbanCardsController>(KanbanCardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
