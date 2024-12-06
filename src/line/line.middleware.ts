import { middleware } from '@line/bot-sdk';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LineMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const mid = middleware({
      channelSecret: process.env.LINE_CHANNEL_SECRET,
    });
    return mid(req, res, next);
  }
}
