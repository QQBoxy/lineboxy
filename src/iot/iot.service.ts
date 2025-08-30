import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import { MqttService } from '../mqtt/mqtt.service';
import { UpdateIotDto } from './dto/update-iot.dto';

@Injectable()
export class IotService {
  private readonly logger = new Logger(IotService.name);
  constructor(private readonly mqttService: MqttService) {}

  findOne(req: Request, topic: string) {
    return `${topic}`;
  }

  update(req: Request, topic: string, updateIotDto: UpdateIotDto) {
    const topics = [
      'vacuum/power/inTopic',
      'duckfan/power/inTopic',
      'lightboxy/switch/inTopic',
      'lightboxy/brightness/inTopic',
    ];
    if (!topics.includes(topic)) {
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
