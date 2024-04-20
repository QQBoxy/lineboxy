import { Test, TestingModule } from '@nestjs/testing';

import { ServiceHeartbeatService } from './service-heartbeat.service';

describe('ServiceHeartbeatService', () => {
  let service: ServiceHeartbeatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceHeartbeatService],
    }).compile();

    service = module.get<ServiceHeartbeatService>(ServiceHeartbeatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
