import { Module } from '@nestjs/common';

import { NightLightModule } from './night-light/night-light.module';
import { ServiceHeartbeatModule } from './service-heartbeat/service-heartbeat.module';
import { VacuumPowerModule } from './vacuum-power/vacuum-power.module';

@Module({
  imports: [ServiceHeartbeatModule, VacuumPowerModule, NightLightModule],
})
export class TaskModule {}
