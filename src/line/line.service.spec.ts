import { Test, TestingModule } from '@nestjs/testing';

import { MqttModule } from '../mqtt/mqtt.module';
import { LineService } from './line.service';
import { ImgurService } from './message/imgur/imgur.service';
import { MessageService } from './message/message.service';
import { RollerShutterService } from './message/roller-shutter/roller-shutter.service';
import { StableDiffusionService } from './message/stable-diffusion/stable-diffusion.service';

describe('LineService', () => {
  let service: LineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MqttModule],
      providers: [
        LineService,
        MessageService,
        StableDiffusionService,
        ImgurService,
        RollerShutterService,
      ],
    }).compile();

    service = module.get<LineService>(LineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
