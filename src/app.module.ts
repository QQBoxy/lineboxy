import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { DataSource } from 'typeorm';

import { AuthModule } from './auth/auth.module';
import { RolesGuard } from './guards/roles.guard';
import { KanbanBoardsModule } from './kanban-boards/kanban-boards.module';
import { LineModule } from './line/line.module';
import { PersonModule } from './person/person.module';
import { Routes } from './routes';
import { SessionSerializer } from './serializer/session.serializer';
import { TaskModule } from './task/task.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public'),
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: path.join(__dirname, '..', 'data', 'db.sqlite'),
      autoLoadEntities: true,
      synchronize: true,
    }),
    Routes,
    LineModule,
    TaskModule,
    UsersModule,
    AuthModule,
    PersonModule,
    KanbanBoardsModule,
  ],
  controllers: [],
  providers: [
    SessionSerializer,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
