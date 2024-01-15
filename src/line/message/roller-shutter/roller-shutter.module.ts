import { Module } from '@nestjs/common';
import { RollerShutterService } from './roller-shutter.service';

@Module({
  providers: [RollerShutterService],
  exports: [RollerShutterService],
})
export class RollerShutterModule {}
