import { Module } from '@nestjs/common';
import { ServiceHeartbeatService } from './service-heartbeat.service';
import { ServiceHeartbeatController } from './service-heartbeat.controller';

@Module({
  providers: [ServiceHeartbeatService],
  controllers: [ServiceHeartbeatController]
})
export class ServiceHeartbeatModule {}
