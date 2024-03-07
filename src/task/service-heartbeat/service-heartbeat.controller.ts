import { Controller } from '@nestjs/common';
import { ServiceHeartbeatService } from './service-heartbeat.service';
import { Cron } from '@nestjs/schedule';

@Controller('service-heartbeat')
export class ServiceHeartbeatController {
  constructor(private readonly serviceHeartbeat: ServiceHeartbeatService) {}

  @Cron('0 */30 * * * *')
  async create() {
    await this.serviceHeartbeat.check('https://www.google.com/');
  }
}
