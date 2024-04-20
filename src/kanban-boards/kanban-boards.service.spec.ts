import { Test, TestingModule } from '@nestjs/testing';
import { KanbanBoardsService } from './kanban-boards.service';

describe('KanbanBoardsService', () => {
  let service: KanbanBoardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KanbanBoardsService],
    }).compile();

    service = module.get<KanbanBoardsService>(KanbanBoardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
