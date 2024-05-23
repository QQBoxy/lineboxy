import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { KanbanList } from '../../kanban-lists/entities/kanban-lists.entity';

@Entity()
export class KanbanCard {
  @PrimaryGeneratedColumn()
  id: number;

  @Exclude()
  @ManyToOne(() => KanbanList, (list) => list.cards, {
    onDelete: 'CASCADE',
  })
  list: KanbanList;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  order: number;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
