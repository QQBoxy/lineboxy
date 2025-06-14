import { Test, TestingModule } from '@nestjs/testing';

import { ServiceHeartbeatController } from './service-heartbeat.controller';
import { ServiceHeartbeatService } from './service-heartbeat.service';

describe('ServiceHeartbeatController', () => {
  let controller: ServiceHeartbeatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceHeartbeatController],
      providers: [ServiceHeartbeatService],
    }).compile();

    controller = module.get<ServiceHeartbeatController>(ServiceHeartbeatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
