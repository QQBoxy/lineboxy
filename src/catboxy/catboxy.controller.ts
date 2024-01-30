import { Controller, Post, Get, Res, Body, Query } from '@nestjs/common';
import { CatboxyService } from './catboxy.service';
import { Response } from 'express';

@Controller('catboxy')
export class CatboxyController {
  constructor(private readonly catboxyService: CatboxyService) {}

  @Post()
  async create(@Body('ms') ms: number, @Res() res: Response) {
    res.json(await this.catboxyService.create(ms));
  }
  @Get()
  async read(@Query('ms') ms: number, @Res() res: Response) {
    res.json(await this.catboxyService.read(ms));
  }
}
