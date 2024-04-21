import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../users/entities/user.entity';
import { CreateKanbanBoardDto } from './dto/create-kanban-board.dto';
import { FindKanbanBoardDto } from './dto/find-kanban-board.dto';
import { UpdateKanbanBoardDto } from './dto/update-kanban-board.dto';
import { KanbanBoard } from './entities/kanban-board.entity';

@Injectable()
export class KanbanBoardsService {
  constructor(
    @InjectRepository(KanbanBoard)
    private kanbanBoardRepository: Repository<KanbanBoard>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(userId: number, createKanbanBoardDto: CreateKanbanBoardDto) {
    const owner = await this.userRepository.findOneBy({ id: userId });

    const kanbanBoard = new KanbanBoard();
    kanbanBoard.name = createKanbanBoardDto.name;
    kanbanBoard.owners = [owner];

    return await this.kanbanBoardRepository.save(kanbanBoard);
  }

  async findAll(req: Req, findKanbanBoardDto: FindKanbanBoardDto) {
    const [data, total] = await this.kanbanBoardRepository.findAndCount({
      relations: ['owners'],
      where: {
        owners: {
          id: req.session.passport.user.id,
        },
      },
      order: {
        createdAt: 'DESC',
      },
      skip: findKanbanBoardDto.offset || 0,
      take: findKanbanBoardDto.limit || 10,
    });
    return {
      data,
      total,
    };
  }

  findOne(req: Req, id: number) {
    return this.kanbanBoardRepository.findOne({
      relations: ['owners'],
      where: {
        id: id,
        owners: {
          id: req.session.passport.user.id,
        },
      },
    });
  }

  async update(id: number, updateKanbanBoardDto: UpdateKanbanBoardDto) {
    const kanbanBoard = new KanbanBoard();
    kanbanBoard.name = updateKanbanBoardDto.name;
    kanbanBoard.updatedAt = new Date();
    await this.kanbanBoardRepository.update({ id: id }, kanbanBoard);
    return this.kanbanBoardRepository.findOneBy({ id: id });
  }

  remove(id: number) {
    return this.kanbanBoardRepository.delete(id);
  }
}
