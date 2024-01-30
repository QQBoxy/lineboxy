import { Test, TestingModule } from '@nestjs/testing';
import { CatboxyService } from './catboxy.service';

describe('CatboxyService', () => {
  let service: CatboxyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CatboxyService],
    }).compile();

    service = module.get<CatboxyService>(CatboxyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
