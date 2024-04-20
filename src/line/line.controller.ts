import { WebhookEvent } from '@line/bot-sdk';
import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { LineService } from './line.service';

@ApiTags('Line')
@Controller('line')
export class LineController {
  constructor(private readonly lineService: LineService) {}

  @Post('webhook')
  @ApiOperation({ summary: 'Line Webhook URL' })
  async create(@Body('events') events: WebhookEvent[], @Res() res: Response) {
    res.json(await this.lineService.create(events));
  }
}
