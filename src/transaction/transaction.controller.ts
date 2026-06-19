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
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { FindTransactionDto } from './dto/find-transaction.dto';
import { GetTotalDto } from './dto/get-total.dto';
import { ListTransactionDto } from './dto/list-transaction.dto';
import { TransactionDto } from './dto/transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionService } from './transaction.service';

@UseInterceptors(ClassSerializerInterceptor)
@ApiCookieAuth()
@ApiTags('Transaction')
@Controller()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @ApiOperation({ summary: 'Create New Transaction' })
  @ApiResponse({
    status: 201,
    description: 'Successful',
    type: TransactionDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @Roles(Role.Admin, Role.User)
  create(@Req() req: Request, @Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.create({
      ...createTransactionDto,
      user: req.session.passport.user as any,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get All Transaction' })
  @ApiResponse({
    status: 200,
    description: 'Successful',
    type: ListTransactionDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @Roles(Role.Admin, Role.User)
  findAll(@Req() req: Request, @Query() findTransactionDto: FindTransactionDto) {
    return this.transactionService.findAll(req, findTransactionDto);
  }

  @Get('total')
  @ApiOperation({ summary: 'Get monthly totals for a specific year' })
  @ApiResponse({
    status: 200,
    description: 'Successful',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          month: { type: 'number', example: 1 },
          total: { type: 'number', example: 1200 },
        },
      },
    },
  })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @Roles(Role.Admin, Role.User)
  getTotal(@Req() req: Request, @Query() getTotalDto: GetTotalDto) {
    return this.transactionService.getTotal(req, getTotalDto.year);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Transaction by ID' })
  @ApiResponse({ status: 200, description: 'Successful', type: TransactionDto })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @Roles(Role.Admin, Role.User)
  findOne(@Req() req: Request, @Param('id') id: string) {
    return this.transactionService.findOne(req, +id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Transaction by ID' })
  @ApiResponse({ status: 200, description: 'Successful', type: TransactionDto })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @Roles(Role.Admin, Role.User)
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionService.update(req, +id, updateTransactionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Transaction by ID' })
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @Roles(Role.Admin, Role.User)
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.transactionService.remove(req, +id);
  }
}
