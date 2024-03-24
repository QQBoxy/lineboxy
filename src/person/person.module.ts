import { Module } from '@nestjs/common';
import { PersonController } from './person.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [PersonController],
})
export class PersonModule {}
