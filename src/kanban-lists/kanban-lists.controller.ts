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
import { CreateKanbanListsDto } from './dto/create-kanban-lists.dto';
import { FindKanbanListDto } from './dto/find-kanban-list.dto';
import { KanbanListsDto } from './dto/kanban-lists.dto';
import { ListKanbanListDto } from './dto/list-kanban-list.dto';
import { UpdateKanbanListsDto } from './dto/update-kanban-lists.dto';
import { KanbanListsService } from './kanban-lists.service';

@UseInterceptors(ClassSerializerInterceptor)
@ApiCookieAuth()
@ApiTags('KanbanLists')
@Controller()
export class KanbanListsController {
  constructor(private readonly kanbanListsService: KanbanListsService) {}

  @Post()
  @ApiOperation({ summary: 'Create New Kanban List' })
  @ApiResponse({
    status: 201,
    description: 'Successful',
    type: KanbanListsDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @Roles(Role.Admin, Role.User)
  create(@Request() req: Request, @Body() createKanbanListsDto: CreateKanbanListsDto) {
    return this.kanbanListsService.create(req, createKanbanListsDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get All Kanban Lists' })
  @ApiResponse({
    status: 200,
    description: 'Successful',
    type: ListKanbanListDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @Roles(Role.Admin, Role.User)
  findAll(@Request() req: Request, @Query() findKanbanListDto: FindKanbanListDto) {
    return this.kanbanListsService.findAll(req, findKanbanListDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Kanban List by ID' })
  @ApiResponse({ status: 200, description: 'Successful', type: KanbanListsDto })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @Roles(Role.Admin, Role.User)
  findOne(@Request() req: Request, @Param('id') id: string) {
    return this.kanbanListsService.findOne(req, +id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Kanban List by ID' })
  @ApiResponse({ status: 200, description: 'Successful', type: ListKanbanListDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @Roles(Role.Admin, Role.User)
  update(
    @Request() req: Request,
    @Param('id') id: string,
    @Body() updateKanbanListsDto: UpdateKanbanListsDto,
  ) {
    return this.kanbanListsService.update(req, +id, updateKanbanListsDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Kanban List by ID' })
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @Roles(Role.Admin, Role.User)
  remove(@Request() req: Request, @Param('id') id: string) {
    return this.kanbanListsService.remove(req, +id);
  }
}
