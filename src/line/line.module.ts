import { Module } from '@nestjs/common';
import { LineService } from './line.service';
import { LineController } from './line.controller';
import { MessageModule } from './message/message.module';

@Module({
  controllers: [LineController],
  providers: [LineService],
  imports: [MessageModule],
})
export class LineModule {}
