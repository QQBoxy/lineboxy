import { Module } from '@nestjs/common';

import { LineController } from './line.controller';
import { LineService } from './line.service';
import { MessageModule } from './message/message.module';

@Module({
  controllers: [LineController],
  providers: [LineService],
  imports: [MessageModule],
})
export class LineModule {}
