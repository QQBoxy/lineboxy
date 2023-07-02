import { Injectable } from '@nestjs/common';
import { Client, WebhookEvent } from '@line/bot-sdk';

@Injectable()
export class LineService {
  async create(events: WebhookEvent[], handler) {
    const client = new Client({
      channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
      channelSecret: process.env.LINE_CHANNEL_SECRET,
    });

    return await Promise.all(
      events.map(async (event) => {
        if (event.type !== 'message' || event.message.type !== 'text') {
          return Promise.resolve(null);
        }
        return await handler(client, event);
      }),
    );
  }
}
