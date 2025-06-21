import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { MqttService } from '../../mqtt/mqtt.service';

@Injectable()
export class VacuumPowerService {
  constructor(private readonly mqttService: MqttService) {}

  @Cron('0 0 15 * * *')
  handleCron() {
    this.mqttService.publish('vacuum/power/inTopic', 'start');
  }
}
