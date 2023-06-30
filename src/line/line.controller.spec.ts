import { Test, TestingModule } from '@nestjs/testing';
import { LineController } from './line.controller';
import { LineService } from './line.service';

describe('LineController', () => {
  let controller: LineController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LineController],
      providers: [LineService],
    }).compile();

    controller = module.get<LineController>(LineController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
