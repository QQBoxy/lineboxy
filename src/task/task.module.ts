import { Module } from '@nestjs/common';
import { ServiceHeartbeatModule } from './service-heartbeat/service-heartbeat.module';

@Module({
  imports: [ServiceHeartbeatModule],
})
export class TaskModule {}
