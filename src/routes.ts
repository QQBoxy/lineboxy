import { RouterModule } from '@nestjs/core';
import { UsersModule } from './users/users.module';
import { PersonModule } from './person/person.module';
import { KanbanBoardsModule } from './kanban-boards/kanban-boards.module';

export const Routes = RouterModule.register([
  {
    path: 'api',
    children: [
      {
        path: 'users',
        module: UsersModule,
      },
      {
        path: 'person',
        module: PersonModule,
      },
      {
        path: 'kanban-boards',
        module: KanbanBoardsModule,
      },
    ],
  },
]);
