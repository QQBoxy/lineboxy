import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { connect, MqttClient } from 'mqtt';

@Injectable()
export class MqttService implements OnModuleInit {
  private readonly logger = new Logger(MqttService.name);
  private mqttClient: MqttClient;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.connect();
  }

  connect() {
    const host = this.configService.get<string>('MQTT_HOST');
    const port = this.configService.get<number>('MQTT_PORT');
    const username = this.configService.get<string>('MQTT_USERNAME');
    const password = this.configService.get<string>('MQTT_PASSWORD');

    this.mqttClient = connect({
      host: host,
      port,
      username,
      password,
      protocol: 'mqtt',
    });

    this.mqttClient.on('connect', () => {
      this.logger.log('MQTT Connected');
    });

    this.mqttClient.on('error', (error) => {
      this.logger.error('MQTT Error:', error);
    });
  }

  publish(topic: string, message: string) {
    this.mqttClient.publish(topic, message);
  }

  subscribe(topic: string, callback: (topic: string, message: Buffer) => void) {
    this.mqttClient.subscribe(topic);

    this.mqttClient.on('message', callback);
  }
}
