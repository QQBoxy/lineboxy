import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { CreateKanbanBoardDto } from './dto/create-kanban-board.dto';
import { FindKanbanBoardDto } from './dto/find-kanban-board.dto';
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
  create(@Req() req: Request, @Body() createKanbanBoardDto: CreateKanbanBoardDto) {
    return this.kanbanBoardsService.create(req, createKanbanBoardDto);
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
  findAll(@Req() req: Request, @Query() findKanbanBoardDto: FindKanbanBoardDto) {
    return this.kanbanBoardsService.findAll(req, findKanbanBoardDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Kanban Board by ID' })
  @ApiResponse({ status: 200, description: 'Successful', type: KanbanBoardDto })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @Roles(Role.Admin, Role.User)
  findOne(@Req() req: Request, @Param('id') id: number) {
    return this.kanbanBoardsService.findOne(req, +id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Kanban Board name by ID' })
  @ApiResponse({ status: 200, description: 'Successful', type: KanbanBoardDto })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @Roles(Role.Admin, Role.User)
  update(
    @Req() req: Request,
    @Param('id') id: number,
    @Body() updateKanbanBoardDto: UpdateKanbanBoardDto,
  ) {
    return this.kanbanBoardsService.update(req, +id, updateKanbanBoardDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Kanban Board by ID' })
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @Roles(Role.Admin, Role.User)
  remove(@Req() req: Request, @Param('id') id: number) {
    return this.kanbanBoardsService.remove(req, +id);
  }
}
