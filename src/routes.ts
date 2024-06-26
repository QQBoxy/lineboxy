import { RouterModule } from '@nestjs/core';

import { KanbanBoardsModule } from './kanban-boards/kanban-boards.module';
import { KanbanCardsModule } from './kanban-cards/kanban-cards.module';
import { KanbanListsModule } from './kanban-lists/kanban-lists.module';
import { PersonModule } from './person/person.module';
import { UsersModule } from './users/users.module';

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
      {
        path: 'kanban-lists',
        module: KanbanListsModule,
      },
      {
        path: 'kanban-cards',
        module: KanbanCardsModule,
      },
    ],
  },
]);
