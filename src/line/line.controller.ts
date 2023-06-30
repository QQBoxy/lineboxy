import { Controller, Post, Body, Res } from '@nestjs/common';
import { LineService } from './line.service';
import { WebhookEvent } from '@line/bot-sdk';
import { Response } from 'express';

@Controller('line')
export class LineController {
  constructor(private readonly lineService: LineService) {}

  @Post('webhook')
  async create(@Body('events') events: WebhookEvent[], @Res() res: Response) {
    res.json(await this.lineService.create(events));
  }
}
