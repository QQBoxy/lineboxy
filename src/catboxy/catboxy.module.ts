import { Module } from '@nestjs/common';
import { CatboxyService } from './catboxy.service';
import { CatboxyController } from './catboxy.controller';

@Module({
  providers: [CatboxyService],
  controllers: [CatboxyController],
})
export class CatboxyModule {}
