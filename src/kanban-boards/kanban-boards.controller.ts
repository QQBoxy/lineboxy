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
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

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
  create(@Request() req, @Body() createKanbanBoardDto: CreateKanbanBoardDto) {
    const session: Session = req.session;
    return this.kanbanBoardsService.create(
      session.passport.user.id,
      createKanbanBoardDto,
    );
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
  findAll(@Request() req: Req, @Query() findKanbanBoardDto: FindKanbanBoardDto) {
    return this.kanbanBoardsService.findAll(req, findKanbanBoardDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Kanban Board by ID' })
  @ApiResponse({ status: 200, description: 'Successful', type: KanbanBoardDto })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @Roles(Role.Admin, Role.User)
  findOne(@Request() req: Req, @Param('id') id: number) {
    return this.kanbanBoardsService.findOne(req, +id);
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
