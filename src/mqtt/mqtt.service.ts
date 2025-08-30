import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { connect, MqttClient } from 'mqtt';
interface PendingPromise {
  resolve: (value: string) => void;
  reject: (reason?: any) => void;
  promise: Promise<string>;
  timeout: NodeJS.Timeout;
}

@Injectable()
export class MqttService implements OnModuleInit {
  private readonly logger = new Logger(MqttService.name);
  private mqttClient: MqttClient;

  private readonly deviceStates = new Map<string, string>();
  private readonly pendingPromises = new Map<string, PendingPromise>();
  private readonly subscribedTopics = new Set<string>();

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.connect();
  }

  connect() {
    const host = this.configService.get<string>('MQTT_HOST');
    const port = this.configService.get<number>('MQTT_PORT');
    const username = this.configService.get<string>('MQTT_USERNAME');
    const password = this.configService.get<string>('MQTT_PASSWORD');

    this.mqttClient = connect({ host, port, username, password, protocol: 'mqtt' });

    this.mqttClient.on('connect', () => {
      this.logger.log('MQTT Connected');
      this.subscribedTopics.forEach((topic) => {
        this.mqttClient.subscribe(topic, (err) => {
          if (err) this.logger.error(`Failed to re-subscribe to topic: ${topic}`, err);
        });
      });
    });

    this.mqttClient.on('error', (error) => {
      this.logger.error('MQTT Error:', error);
    });

    this.mqttClient.on('message', (topic, message) => {
      const state = message.toString();
      this.deviceStates.set(topic, state);

      if (this.pendingPromises.has(topic)) {
        const pending = this.pendingPromises.get(topic);
        clearTimeout(pending.timeout);
        pending.resolve(state);
        this.pendingPromises.delete(topic);
      }
    });
  }

  publish(topic: string, message: string) {
    this.mqttClient.publish(topic, message);
  }

  getState(topic: string): Promise<string> {
    if (this.deviceStates.has(topic)) {
      return Promise.resolve(this.deviceStates.get(topic));
    }

    if (this.pendingPromises.has(topic)) {
      return this.pendingPromises.get(topic).promise;
    }

    let resolveFn: (value: string) => void;
    let rejectFn: (reason?: any) => void;

    const promise = new Promise<string>((resolve, reject) => {
      resolveFn = resolve;
      rejectFn = reject;
    });

    const timeout = setTimeout(() => {
      if (this.pendingPromises.has(topic)) {
        this.pendingPromises
          .get(topic)
          .reject(
            new Error(
              `Timeout: No message received on topic [${topic}] within 5 seconds.`,
            ),
          );
        this.pendingPromises.delete(topic);
      }
    }, 5000);

    this.pendingPromises.set(topic, {
      resolve: resolveFn,
      reject: rejectFn,
      promise,
      timeout,
    });

    if (!this.subscribedTopics.has(topic)) {
      this.mqttClient.subscribe(topic, (err) => {
        if (err) {
          if (this.pendingPromises.has(topic)) {
            const pending = this.pendingPromises.get(topic);
            clearTimeout(pending.timeout);
            pending.reject(err);
            this.pendingPromises.delete(topic);
          }
        } else {
          this.subscribedTopics.add(topic);
        }
      });
    }

    return promise;
  }
}
