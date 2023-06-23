import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LineModule } from './line.module';

@Module({
  imports: [ConfigModule.forRoot(), LineModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
