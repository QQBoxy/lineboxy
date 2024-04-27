import { Test, TestingModule } from '@nestjs/testing';

import { KanbanListsService } from './kanban-lists.service';

describe('KanbanListsService', () => {
  let service: KanbanListsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KanbanListsService],
    }).compile();

    service = module.get<KanbanListsService>(KanbanListsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
