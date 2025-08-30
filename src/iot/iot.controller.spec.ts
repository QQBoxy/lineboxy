import { Test, TestingModule } from '@nestjs/testing';

import { MqttModule } from '../mqtt/mqtt.module';
import { IotController } from './iot.controller';
import { IotService } from './iot.service';

describe('IotController', () => {
  let controller: IotController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MqttModule],
      controllers: [IotController],
      providers: [IotService],
    }).compile();

    controller = module.get<IotController>(IotController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
