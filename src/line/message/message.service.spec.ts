import { Test, TestingModule } from '@nestjs/testing';

import { MqttModule } from '../../mqtt/mqtt.module';
import { ImgurService } from './imgur/imgur.service';
import { MessageService } from './message.service';
import { RollerShutterService } from './roller-shutter/roller-shutter.service';
import { StableDiffusionService } from './stable-diffusion/stable-diffusion.service';

describe('MessageService', () => {
  let service: MessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MqttModule],
      providers: [
        MessageService,
        StableDiffusionService,
        ImgurService,
        RollerShutterService,
      ],
    }).compile();

    service = module.get<MessageService>(MessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
