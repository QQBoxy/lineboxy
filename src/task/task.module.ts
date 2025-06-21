import { Module } from '@nestjs/common';

import { ServiceHeartbeatModule } from './service-heartbeat/service-heartbeat.module';
import { VacuumPowerModule } from './vacuum-power/vacuum-power.module';

@Module({
  imports: [ServiceHeartbeatModule, VacuumPowerModule],
})
export class TaskModule {}
