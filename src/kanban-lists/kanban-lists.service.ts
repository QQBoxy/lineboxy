import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';

import { KanbanBoard } from '../kanban-boards/entities/kanban-board.entity';
import { CreateKanbanListsDto } from './dto/create-kanban-lists.dto';
import { FindKanbanListDto } from './dto/find-kanban-list.dto';
import { UpdateKanbanListsDto } from './dto/update-kanban-lists.dto';
import { KanbanList } from './entities/kanban-lists.entity';

@Injectable()
export class KanbanListsService {
  constructor(
    @InjectRepository(KanbanList)
    private kanbanListRepository: Repository<KanbanList>,
    @InjectRepository(KanbanBoard)
    private kanbanBoardRepository: Repository<KanbanBoard>,
  ) {}
  async create(req: Req, createKanbanListsDto: CreateKanbanListsDto) {
    // Check board exists
    const board = await this.kanbanBoardRepository.findOne({
      relations: ['owners'],
      where: {
        id: createKanbanListsDto.boardId,
        owners: {
          id: req.session.passport.user.id,
        },
      },
    });
    if (!board) {
      throw new UnauthorizedException();
    }
    // Get order of last list
    const list = await this.kanbanListRepository.findOne({
      relations: ['board'],
      where: {
        board: {
          id: board.id,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });
    const nextOrder = list?.order + 1 || 0;
    // Create new list
    const kanbanList = new KanbanList();
    kanbanList.name = createKanbanListsDto.name;
    kanbanList.order = nextOrder;
    kanbanList.board = board;

    return await this.kanbanListRepository.save(kanbanList);
  }

  async findAll(req: Req, findKanbanListDto: FindKanbanListDto) {
    // Check board exists
    const board = await this.kanbanBoardRepository.findOne({
      relations: ['owners'],
      where: {
        id: findKanbanListDto.boardId,
        owners: {
          id: req.session.passport.user.id,
        },
      },
    });
    if (!board) {
      return {
        data: [],
        total: 0,
      };
    }
    // Get all lists
    const [data, total] = await this.kanbanListRepository.findAndCount({
      relations: ['board'],
      where: {
        board: {
          id: board.id,
        },
      },
      order: {
        order: 'DESC',
      },
      skip: findKanbanListDto.offset || 0,
      take: findKanbanListDto.limit || 10,
    });
    return {
      data,
      total,
    };
  }

  async findOne(req: Req, id: number) {
    // Get list
    const list = await this.kanbanListRepository.findOne({
      relations: ['board'],
      where: {
        id: id,
      },
    });
    if (!list) {
      throw new NotFoundException();
    }
    // Check board exists
    const board = await this.kanbanBoardRepository.findOne({
      relations: ['owners'],
      where: {
        id: list.board.id,
        owners: {
          id: req.session.passport.user.id,
        },
      },
    });
    if (!board) {
      throw new UnauthorizedException();
    }
    return list;
  }

  async update(req: Req, id: number, updateKanbanListsDto: UpdateKanbanListsDto) {
    // Get list
    const list = await this.kanbanListRepository.findOne({
      relations: ['board'],
      where: {
        id: id,
        board: {
          owners: {
            id: req.session.passport.user.id,
          },
        },
      },
    });
    // Check list exists
    if (!list) {
      throw new NotFoundException();
    }
    // [from, to]
    const boundary: [number, number] = [
      updateKanbanListsDto?.order ?? list.order,
      list.order,
    ];
    // Sort order ascending
    if (boundary[0] > boundary[1]) {
      boundary.reverse();
    }
    // Lists length
    const length = boundary[1] - boundary[0] + 1;
    // Get target lists
    const lists = await this.kanbanListRepository.find({
      relations: ['board'],
      where: {
        board: {
          id: list.board.id,
        },
        order: Between(...boundary),
      },
    });
    // Check length
    if (lists.length !== length) {
      throw new BadRequestException();
    }
    // Increase or decrease order
    const increase = list.order > updateKanbanListsDto.order ? 1 : -1;
    // Update lists
    for (const list of lists) {
      const kanbanList = new KanbanList();
      if (list.id === id) {
        // Update name
        if (updateKanbanListsDto.name) {
          kanbanList.name = updateKanbanListsDto.name;
        }
        list.order = updateKanbanListsDto.order;
        kanbanList.order = list.order;
      } else {
        list.order += increase;
        kanbanList.order = list.order;
      }
      kanbanList.updatedAt = new Date();
      await this.kanbanListRepository.update({ id: list.id }, kanbanList);
    }
    return {
      data: lists,
      total: length,
    };
  }

  async remove(req: Req, id: number) {
    // Get list
    const list = await this.kanbanListRepository.findOne({
      relations: ['board'],
      where: {
        id: id,
        board: {
          owners: {
            id: req.session.passport.user.id,
          },
        },
      },
    });
    // Check list exists
    if (!list) {
      throw new NotFoundException();
    }
    return this.kanbanListRepository.delete(id);
  }
}
