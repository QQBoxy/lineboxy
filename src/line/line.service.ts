import { Client, WebhookEvent } from '@line/bot-sdk';
import { Injectable } from '@nestjs/common';

import { MessageService } from './message/message.service';

@Injectable()
export class LineService {
  constructor(private readonly messageService: MessageService) {}
  async create(events: WebhookEvent[]) {
    const client = new Client({
      channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
      channelSecret: process.env.LINE_CHANNEL_SECRET,
    });

    return await Promise.all(
      events.map(async (event) => {
        if (event.type !== 'message' || event.message.type !== 'text') {
          return Promise.resolve(null);
        }
        return await this.messageService.create(client, event);
      }),
    );
  }
}
