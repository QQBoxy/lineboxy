import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';

import { KanbanList } from '../kanban-lists/entities/kanban-lists.entity';
import { CreateKanbanCardDto } from './dto/create-kanban-card.dto';
import { FindKanbanCardDto } from './dto/find-kanban-card.dto';
import { UpdateKanbanCardDto } from './dto/update-kanban-card.dto';
import { KanbanCard } from './entities/kanban-card.entity';

@Injectable()
export class KanbanCardsService {
  constructor(
    @InjectRepository(KanbanCard)
    private kanbanCardRepository: Repository<KanbanCard>,
    @InjectRepository(KanbanList)
    private kanbanListRepository: Repository<KanbanList>,
  ) {}
  async create(req: Request, createKanbanCardDto: CreateKanbanCardDto) {
    // Check list exists
    const list = await this.kanbanListRepository.findOne({
      relations: ['board'],
      where: {
        id: createKanbanCardDto.listId,
        board: {
          owners: {
            id: req.session.passport.user.id,
          },
        },
      },
    });
    if (!list) {
      throw new UnauthorizedException();
    }
    // Get order of last card
    const card = await this.kanbanCardRepository.findOne({
      relations: ['list'],
      where: {
        list: {
          id: list.id,
        },
      },
      order: {
        order: 'DESC',
      },
    });
    const nextOrder = card?.order + 1 || 0;
    // Create new card
    const kanbanCard = new KanbanCard();
    kanbanCard.title = createKanbanCardDto.title;
    kanbanCard.description = createKanbanCardDto.description;
    kanbanCard.order = nextOrder;
    kanbanCard.list = list;

    return await this.kanbanCardRepository.save(kanbanCard);
  }

  async findAll(req: Request, findKanbanCardDto: FindKanbanCardDto) {
    // Get all cards
    const [data, total] = await this.kanbanCardRepository.findAndCount({
      relations: ['list'],
      where: {
        list: {
          id: findKanbanCardDto.listId,
          board: {
            owners: {
              id: req.session.passport.user.id,
            },
          },
        },
      },
      order: {
        order: 'DESC',
      },
      skip: findKanbanCardDto.offset || 0,
      take: findKanbanCardDto.limit || 10,
    });
    return {
      data,
      total,
    };
  }

  async findOne(req: Request, id: number) {
    // Get Card
    const card = await this.kanbanCardRepository.findOne({
      relations: ['list'],
      where: {
        id: id,
        list: {
          board: {
            owners: {
              id: req.session.passport.user.id,
            },
          },
        },
      },
    });
    if (!card) {
      throw new NotFoundException();
    }
    return card;
  }

  async update(req: Request, id: number, updateKanbanCardDto: UpdateKanbanCardDto) {
    // Get Card
    const card = await this.kanbanCardRepository.findOne({
      relations: ['list'],
      where: {
        id: id,
        list: {
          board: {
            owners: {
              id: req.session.passport.user.id,
            },
          },
        },
      },
    });
    // Check Card exists
    if (!card) {
      throw new NotFoundException();
    }
    // [from, to]
    const boundary: [number, number] = [
      updateKanbanCardDto?.order ?? card.order,
      card.order,
    ];
    // Sort order ascending
    if (boundary[0] > boundary[1]) {
      boundary.reverse();
    }
    // Get target cards
    const cards = await this.kanbanCardRepository.find({
      relations: ['list'],
      where: {
        list: {
          id: card.list.id,
        },
        order: Between(...boundary),
      },
    });
    // Check length
    if (cards.length < 1) {
      throw new BadRequestException();
    }
    // Increase or decrease order
    const increase = card.order > updateKanbanCardDto.order ? 1 : -1;
    // Update cards
    for (const card of cards) {
      const kanbanCard = new KanbanCard();
      if (card.id === id) {
        // Update name
        if (updateKanbanCardDto.title) {
          kanbanCard.title = updateKanbanCardDto.title;
        }
        if (updateKanbanCardDto.description) {
          kanbanCard.description = updateKanbanCardDto.description;
        }
        card.order = updateKanbanCardDto.order;
      } else {
        card.order += increase;
      }
      kanbanCard.order = card.order;
      kanbanCard.updatedAt = new Date();
      await this.kanbanCardRepository.update({ id: card.id }, kanbanCard);
    }
    return {
      data: cards,
      total: cards.length,
    };
  }

  async remove(req: Request, id: number) {
    // Get card
    const card = await this.kanbanCardRepository.findOne({
      relations: ['list'],
      where: {
        id: id,
        list: {
          board: {
            owners: {
              id: req.session.passport.user.id,
            },
          },
        },
      },
    });
    if (!card) {
      throw new NotFoundException();
    }
    return this.kanbanCardRepository.delete(id);
  }
}
