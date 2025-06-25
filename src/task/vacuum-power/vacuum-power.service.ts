import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { MqttService } from '../../mqtt/mqtt.service';

@Injectable()
export class VacuumPowerService {
  constructor(private readonly mqttService: MqttService) {}

  @Cron(CronExpression.EVERY_DAY_AT_3PM)
  handleCron() {
    this.mqttService.publish('vacuum/power/inTopic', 'start');
  }
}
