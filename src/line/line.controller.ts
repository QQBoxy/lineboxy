import { Controller, Post, Body, Res } from '@nestjs/common';
import { LineService } from './line.service';
import { MessageService } from './message/message.service';
import { WebhookEvent } from '@line/bot-sdk';
import { Response } from 'express';

@Controller('line')
export class LineController {
  constructor(
    private readonly lineService: LineService,
    private readonly messageService: MessageService,
  ) {}

  @Post('webhook')
  async create(@Body('events') events: WebhookEvent[], @Res() res: Response) {
    res.json(await this.lineService.create(events, this.messageService.create));
  }
}
