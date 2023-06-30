import { Module } from '@nestjs/common';
import { LineService } from './line.service';
import { LineController } from './line.controller';

@Module({
  controllers: [LineController],
  providers: [LineService],
})
export class LineModule {}
