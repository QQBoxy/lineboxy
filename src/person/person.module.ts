import { Module } from '@nestjs/common';

import { UsersModule } from '../users/users.module';
import { PersonController } from './person.controller';

@Module({
  imports: [UsersModule],
  controllers: [PersonController],
})
export class PersonModule {}
