import { Controller } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { ServiceHeartbeatService } from './service-heartbeat.service';

@Controller('service-heartbeat')
export class ServiceHeartbeatController {
  constructor(private readonly serviceHeartbeat: ServiceHeartbeatService) {}

  @Cron('0 */30 * * * *')
  async create() {
    await this.serviceHeartbeat.check('https://www.google.com/');
  }
}
