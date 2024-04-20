import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateKanbanBoardDto } from './dto/create-kanban-board.dto';
import { UpdateKanbanBoardDto } from './dto/update-kanban-board.dto';
import { KanbanBoard } from './entities/kanban-board.entity';

@Injectable()
export class KanbanBoardsService {
  constructor(
    @InjectRepository(KanbanBoard)
    private kanbanBoardRepository: Repository<KanbanBoard>,
  ) {}

  create(createKanbanBoardDto: CreateKanbanBoardDto) {
    const kanbanBoard = new KanbanBoard();
    kanbanBoard.name = createKanbanBoardDto.name;
    return this.kanbanBoardRepository.save(kanbanBoard);
  }

  findAll() {
    return this.kanbanBoardRepository.find();
  }

  findOne(id: number) {
    return this.kanbanBoardRepository.findOneBy({ id: id });
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
