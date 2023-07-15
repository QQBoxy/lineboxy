import { Test, TestingModule } from '@nestjs/testing';
import { StableDiffusionService } from './stable-diffusion.service';

describe('StableDiffusionService', () => {
  let service: StableDiffusionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StableDiffusionService],
    }).compile();

    service = module.get<StableDiffusionService>(StableDiffusionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
