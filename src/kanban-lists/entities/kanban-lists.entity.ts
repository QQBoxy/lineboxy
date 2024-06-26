import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { KanbanBoard } from '../../kanban-boards/entities/kanban-board.entity';
import { KanbanCard } from '../../kanban-cards/entities/kanban-card.entity';

@Entity()
export class KanbanList {
  @PrimaryGeneratedColumn()
  id: number;

  @Exclude()
  @ManyToOne(() => KanbanBoard, (board) => board.lists, {
    onDelete: 'CASCADE',
  })
  board: KanbanBoard;

  @OneToMany(() => KanbanCard, (card) => card.list)
  cards: KanbanCard[];

  @Column()
  name: string;

  @Column()
  order: number;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
