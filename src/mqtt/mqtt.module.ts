import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { MqttService } from './mqtt.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [MqttService],
  exports: [MqttService],
})
export class MqttModule {}
