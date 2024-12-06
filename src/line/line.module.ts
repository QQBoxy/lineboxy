import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { LineController } from './line.controller';
import { LineMiddleware } from './line.middleware';
import { LineService } from './line.service';
import { MessageModule } from './message/message.module';

@Module({
  controllers: [LineController],
  providers: [LineService],
  imports: [MessageModule],
})
// export class LineModule {}
export class LineModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LineMiddleware).forRoutes(LineController);
  }
}
