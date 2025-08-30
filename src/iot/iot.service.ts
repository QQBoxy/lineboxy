import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import { MqttService } from '../mqtt/mqtt.service';
import { UpdateIotDto } from './dto/update-iot.dto';

@Injectable()
export class IotService {
  private readonly logger = new Logger(IotService.name);
  private readonly inTopic = [
    'vacuum/power/inTopic',
    'duckfan/power/inTopic',
    'lightboxy/switch/inTopic',
    'lightboxy/brightness/inTopic',
  ];
  private readonly outTopic = [
    'vacuum/power/outTopic',
    'duckfan/power/outTopic',
    'lightboxy/switch/outTopic',
    'lightboxy/brightness/outTopic',
  ];
  constructor(private readonly mqttService: MqttService) {}

  async findOne(req: Request, topic: string) {
    if (!this.outTopic.includes(topic)) {
      throw new BadRequestException();
    }
    const message = await this.mqttService.getState(topic);
    return { topic, message };
  }

  update(req: Request, topic: string, updateIotDto: UpdateIotDto) {
    if (!this.inTopic.includes(topic)) {
      throw new BadRequestException();
    }
    const message = updateIotDto.message;
    this.mqttService.publish(topic, message);
    this.logger.log(`${topic}, ${message}`);

    return {
      topic,
      message,
    };
  }
}
