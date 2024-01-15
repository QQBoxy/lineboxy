import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { StableDiffusionModule } from './stable-diffusion/stable-diffusion.module';
import { ImgurModule } from './imgur/imgur.module';
import { RollerShutterModule } from './roller-shutter/roller-shutter.module';

@Module({
  providers: [MessageService],
  exports: [MessageService],
  imports: [StableDiffusionModule, ImgurModule, RollerShutterModule],
})
export class MessageModule {}
