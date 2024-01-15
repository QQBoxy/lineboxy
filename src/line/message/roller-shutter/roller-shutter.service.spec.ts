import { Test, TestingModule } from '@nestjs/testing';
import { RollerShutterService } from './roller-shutter.service';

describe('RollerShutterService', () => {
  let service: RollerShutterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RollerShutterService],
    }).compile();

    service = module.get<RollerShutterService>(RollerShutterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
