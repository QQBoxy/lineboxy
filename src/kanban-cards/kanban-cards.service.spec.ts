import { Test, TestingModule } from '@nestjs/testing';

import { KanbanCardsService } from './kanban-cards.service';

describe('KanbanCardsService', () => {
  let service: KanbanCardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KanbanCardsService],
    }).compile();

    service = module.get<KanbanCardsService>(KanbanCardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
