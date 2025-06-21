import { Module } from '@nestjs/common';

import { VacuumPowerService } from './vacuum-power.service';

@Module({
  providers: [VacuumPowerService],
})
export class VacuumPowerModule {}
