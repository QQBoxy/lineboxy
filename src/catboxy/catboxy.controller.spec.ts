import { Test, TestingModule } from '@nestjs/testing';
import { CatboxyController } from './catboxy.controller';

describe('CatboxyController', () => {
  let controller: CatboxyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatboxyController],
    }).compile();

    controller = module.get<CatboxyController>(CatboxyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
