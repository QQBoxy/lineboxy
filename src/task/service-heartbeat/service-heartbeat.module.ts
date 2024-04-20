import { Module } from '@nestjs/common';

import { ServiceHeartbeatController } from './service-heartbeat.controller';
import { ServiceHeartbeatService } from './service-heartbeat.service';

@Module({
  providers: [ServiceHeartbeatService],
  controllers: [ServiceHeartbeatController],
})
export class ServiceHeartbeatModule {}
