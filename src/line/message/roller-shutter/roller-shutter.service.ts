import { Injectable } from '@nestjs/common';
import mqtt from 'mqtt';

@Injectable()
export class RollerShutterService {
  async create(): Promise<string> {
    try {
      const client = mqtt.connect(process.env.MQTT_SERVER, {
        username: process.env.MQTT_USERNAME,
        password: process.env.MQTT_PASSWORD,
      });
      client.publish('company/door/inTopic', '1');
      client.publish('company/door/inTopic', '0');
    } catch (e) {
      return '';
    }
  }
}
