import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { KanbanBoard } from '../../kanban-boards/entities/kanban-board.entity';

@Entity()
export class KanbanList {
  @PrimaryGeneratedColumn()
  id: number;

  @Exclude()
  // @ManyToOne(() => KanbanBoard, (board) => board.lists, {
  //   cascade: true,
  //   onDelete: 'CASCADE',
  // })
  @ManyToOne(() => KanbanBoard, (board) => board.lists, {
    onDelete: 'CASCADE',
  })
  board: KanbanBoard;

  @Column()
  name: string;

  @Column()
  order: number;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
