import { Module } from '@nestjs/common';

import { NightLightService } from './night-light.service';

@Module({
  providers: [NightLightService],
})
export class NightLightModule {}
