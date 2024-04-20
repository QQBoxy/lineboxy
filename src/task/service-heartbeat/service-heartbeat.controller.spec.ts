import { Test, TestingModule } from '@nestjs/testing';

import { ServiceHeartbeatController } from './service-heartbeat.controller';

describe('ServiceHeartbeatController', () => {
  let controller: ServiceHeartbeatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceHeartbeatController],
    }).compile();

    controller = module.get<ServiceHeartbeatController>(ServiceHeartbeatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
