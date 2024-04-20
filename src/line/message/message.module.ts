import { Module } from '@nestjs/common';

import { ImgurModule } from './imgur/imgur.module';
import { MessageService } from './message.service';
import { RollerShutterModule } from './roller-shutter/roller-shutter.module';
import { StableDiffusionModule } from './stable-diffusion/stable-diffusion.module';

@Module({
  providers: [MessageService],
  exports: [MessageService],
  imports: [StableDiffusionModule, ImgurModule, RollerShutterModule],
})
export class MessageModule {}
