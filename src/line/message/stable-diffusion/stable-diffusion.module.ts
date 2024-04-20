import { Module } from '@nestjs/common';

import { StableDiffusionService } from './stable-diffusion.service';

@Module({
  providers: [StableDiffusionService],
  exports: [StableDiffusionService],
})
export class StableDiffusionModule {}
