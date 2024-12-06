import { Test, TestingModule } from '@nestjs/testing';

import { LineController } from './line.controller';
import { LineService } from './line.service';
import { ImgurService } from './message/imgur/imgur.service';
import { MessageService } from './message/message.service';
import { RollerShutterService } from './message/roller-shutter/roller-shutter.service';
import { StableDiffusionService } from './message/stable-diffusion/stable-diffusion.service';

describe('LineController', () => {
  let controller: LineController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LineController],
      providers: [
        LineService,
        MessageService,
        StableDiffusionService,
        ImgurService,
        RollerShutterService,
      ],
    }).compile();

    controller = module.get<LineController>(LineController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
