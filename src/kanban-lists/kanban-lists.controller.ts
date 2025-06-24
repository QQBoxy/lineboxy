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
import { CreateKanbanListDto } from './dto/create-kanban-list.dto';
import { FindKanbanListDto } from './dto/find-kanban-list.dto';
import { KanbanListDto } from './dto/kanban-list.dto';
import { ListKanbanListDto } from './dto/list-kanban-list.dto';
import { UpdateKanbanListsDto } from './dto/update-kanban-list.dto';
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
    type: KanbanListDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @Roles(Role.Admin, Role.User)
  create(@Req() req: Request, @Body() createKanbanListDto: CreateKanbanListDto) {
    return this.kanbanListsService.create(req, createKanbanListDto);
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
  findAll(@Req() req: Request, @Query() findKanbanListDto: FindKanbanListDto) {
    return this.kanbanListsService.findAll(req, findKanbanListDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Kanban List by ID' })
  @ApiResponse({ status: 200, description: 'Successful', type: KanbanListDto })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @Roles(Role.Admin, Role.User)
  findOne(@Req() req: Request, @Param('id') id: string) {
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
    @Req() req: Request,
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
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.kanbanListsService.remove(req, +id);
  }
}
