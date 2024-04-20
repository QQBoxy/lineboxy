import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { CreateKanbanBoardDto } from './dto/create-kanban-board.dto';
import { KanbanBoardDto } from './dto/kanban-board.dto';
import { ListKanbanBoardDto } from './dto/list-kanban-board.dto';
import { UpdateKanbanBoardDto } from './dto/update-kanban-board.dto';
import { KanbanBoardsService } from './kanban-boards.service';

@UseInterceptors(ClassSerializerInterceptor)
@ApiCookieAuth()
@ApiTags('KanbanBoards')
@Controller()
export class KanbanBoardsController {
  constructor(private readonly kanbanBoardsService: KanbanBoardsService) {}

  @Post()
  @ApiOperation({ summary: 'Create New Kanban Board' })
  @ApiResponse({
    status: 201,
    description: 'Successful',
    type: KanbanBoardDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @Roles(Role.Admin, Role.User)
  create(@Body() createKanbanBoardDto: CreateKanbanBoardDto) {
    return this.kanbanBoardsService.create(createKanbanBoardDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get All Kanban Boards' })
  @ApiResponse({
    status: 200,
    description: 'Successful',
    type: ListKanbanBoardDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @Roles(Role.Admin, Role.User)
  findAll() {
    return this.kanbanBoardsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Kanban Board by ID' })
  @ApiResponse({ status: 200, description: 'Successful', type: KanbanBoardDto })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @Roles(Role.Admin, Role.User)
  findOne(@Param('id') id: number) {
    return this.kanbanBoardsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Kanban Board name by ID' })
  @ApiResponse({ status: 200, description: 'Successful', type: KanbanBoardDto })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @Roles(Role.Admin, Role.User)
  update(@Param('id') id: number, @Body() updateKanbanBoardDto: UpdateKanbanBoardDto) {
    return this.kanbanBoardsService.update(+id, updateKanbanBoardDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Kanban Board by ID' })
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @Roles(Role.Admin, Role.User)
  remove(@Param('id') id: number) {
    return this.kanbanBoardsService.remove(+id);
  }
}
