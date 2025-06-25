import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { MqttService } from '../../mqtt/mqtt.service';

@Injectable()
export class NightLightService {
  constructor(private readonly mqttService: MqttService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  handleNightLightOn() {
    this.mqttService.publish('lightboxy/brightness/inTopic', '1');
    this.mqttService.publish('lightboxy/switch/inTopic', '1');
  }

  @Cron(CronExpression.EVERY_DAY_AT_6AM)
  handleNightLightOff() {
    this.mqttService.publish('lightboxy/switch/inTopic', '0');
  }
}
