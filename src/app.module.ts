import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LineModule } from './line/line.module';
import { CatboxyModule } from './catboxy/catboxy.module';

@Module({
  imports: [ConfigModule.forRoot(), LineModule, CatboxyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
