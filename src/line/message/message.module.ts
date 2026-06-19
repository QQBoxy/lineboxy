import { Module } from '@nestjs/common';

import { TransactionModule } from '../../transaction/transaction.module';
import { UsersModule } from '../../users/users.module';
import { ExpenseService } from './expense/expense.service';
import { ImgurModule } from './imgur/imgur.module';
import { MessageService } from './message.service';
import { RollerShutterModule } from './roller-shutter/roller-shutter.module';
import { StableDiffusionModule } from './stable-diffusion/stable-diffusion.module';

@Module({
  providers: [MessageService, ExpenseService],
  exports: [MessageService],
  imports: [
    TransactionModule,
    UsersModule,
    StableDiffusionModule,
    ImgurModule,
    RollerShutterModule,
  ],
})
export class MessageModule {}
