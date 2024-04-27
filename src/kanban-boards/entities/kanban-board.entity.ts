import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { KanbanList } from '../../kanban-lists/entities/kanban-lists.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class KanbanBoard {
  @PrimaryGeneratedColumn()
  id: number;

  @Exclude()
  @ManyToMany(() => User)
  @JoinTable()
  owners: User[];

  @Column()
  name: string;

  @OneToMany(() => KanbanList, (list) => list.board)
  lists: KanbanList[];

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
