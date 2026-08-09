import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AuthenticatedRequest } from '../types/request';
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

  async create(req: AuthenticatedRequest, createKanbanBoardDto: CreateKanbanBoardDto) {
    const owner = await this.userRepository.findOneBy({
      id: req.user.id,
    });

    const kanbanBoard = new KanbanBoard();
    kanbanBoard.name = createKanbanBoardDto.name;
    kanbanBoard.owners = [owner];

    return await this.kanbanBoardRepository.save(kanbanBoard);
  }

  async findAll(req: AuthenticatedRequest, findKanbanBoardDto: FindKanbanBoardDto) {
    const [data, total] = await this.kanbanBoardRepository.findAndCount({
      relations: { owners: true },
      where: {
        owners: {
          id: req.user.id,
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

  async findOne(req: AuthenticatedRequest, id: number) {
    const kanbanBoard = await this.kanbanBoardRepository.findOne({
      relations: { owners: true },
      where: {
        id: id,
        owners: {
          id: req.user.id,
        },
      },
    });
    if (!kanbanBoard) {
      throw new NotFoundException();
    }
    return kanbanBoard;
  }

  async update(
    req: AuthenticatedRequest,
    id: number,
    updateKanbanBoardDto: UpdateKanbanBoardDto,
  ) {
    // Check board exists
    const kanbanBoard = await this.kanbanBoardRepository.findOne({
      relations: { owners: true },
      where: {
        id: id,
        owners: {
          id: req.user.id,
        },
      },
    });
    if (!kanbanBoard) {
      throw new UnauthorizedException();
    }
    // Update
    const newKanbanBoard = new KanbanBoard();
    newKanbanBoard.name = updateKanbanBoardDto.name;
    newKanbanBoard.updatedAt = new Date();
    await this.kanbanBoardRepository.update(
      {
        id: kanbanBoard.id,
      },
      newKanbanBoard,
    );
    return this.kanbanBoardRepository.findOneBy({ id: id });
  }

  async remove(req: AuthenticatedRequest, id: number) {
    // Check board exists
    const kanbanBoard = await this.kanbanBoardRepository.findOne({
      relations: { owners: true },
      where: {
        id: id,
        owners: {
          id: req.user.id,
        },
      },
    });
    if (!kanbanBoard) {
      throw new UnauthorizedException();
    }
    return this.kanbanBoardRepository.delete(id);
  }
}
