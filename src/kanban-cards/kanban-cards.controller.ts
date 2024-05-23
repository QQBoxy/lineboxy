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
import { CreateKanbanCardDto } from './dto/create-kanban-card.dto';
import { FindKanbanCardDto } from './dto/find-kanban-card.dto';
import { KanbanCardDto } from './dto/kanban-card.dto';
import { ListKanbanCardDto } from './dto/list-kanban-card.dto';
import { UpdateKanbanCardDto } from './dto/update-kanban-card.dto';
import { KanbanCardsService } from './kanban-cards.service';

@UseInterceptors(ClassSerializerInterceptor)
@ApiCookieAuth()
@ApiTags('KanbanCards')
@Controller()
export class KanbanCardsController {
  constructor(private readonly kanbanCardsService: KanbanCardsService) {}

  @Post()
  @ApiOperation({ summary: 'Create New Kanban Card' })
  @ApiResponse({
    status: 201,
    description: 'Successful',
    type: KanbanCardDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @Roles(Role.Admin, Role.User)
  create(@Request() req: Request, @Body() createKanbanCardDto: CreateKanbanCardDto) {
    return this.kanbanCardsService.create(req, createKanbanCardDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get All Kanban Cards' })
  @ApiResponse({
    status: 200,
    description: 'Successful',
    type: ListKanbanCardDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @Roles(Role.Admin, Role.User)
  findAll(@Request() req: Request, @Query() findKanbanCardDto: FindKanbanCardDto) {
    return this.kanbanCardsService.findAll(req, findKanbanCardDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Kanban Card by ID' })
  @ApiResponse({ status: 200, description: 'Successful', type: KanbanCardDto })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @Roles(Role.Admin, Role.User)
  findOne(@Request() req: Request, @Param('id') id: string) {
    return this.kanbanCardsService.findOne(req, +id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Kanban Card by ID' })
  @ApiResponse({ status: 200, description: 'Successful', type: ListKanbanCardDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @Roles(Role.Admin, Role.User)
  update(
    @Request() req: Request,
    @Param('id') id: string,
    @Body() updateKanbanCardDto: UpdateKanbanCardDto,
  ) {
    return this.kanbanCardsService.update(req, +id, updateKanbanCardDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Kanban Card by ID' })
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @Roles(Role.Admin, Role.User)
  remove(@Request() req: Request, @Param('id') id: string) {
    return this.kanbanCardsService.remove(req, +id);
  }
}
