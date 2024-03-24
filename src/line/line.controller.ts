import { Controller, Post, Body, Res } from '@nestjs/common';
import { LineService } from './line.service';
import { WebhookEvent } from '@line/bot-sdk';
import { Response } from 'express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('LineBot')
@Controller('line')
export class LineController {
  constructor(private readonly lineService: LineService) {}

  @Post('webhook')
  @ApiOperation({ summary: 'Line Webhook URL' })
  async create(@Body('events') events: WebhookEvent[], @Res() res: Response) {
    res.json(await this.lineService.create(events));
  }
}
