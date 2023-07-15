import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { StableDiffusionModule } from './stable-diffusion/stable-diffusion.module';

@Module({
  providers: [MessageService],
  exports: [MessageService],
  imports: [StableDiffusionModule],
})
export class MessageModule {}
