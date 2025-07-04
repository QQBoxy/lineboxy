import { MessageEvent, messagingApi } from '@line/bot-sdk';
import { Injectable, Logger } from '@nestjs/common';
import * as _ from 'lodash';

import { MqttService } from '../../mqtt/mqtt.service';
import * as flexRules from './flex-rules.json';
import { ImgurService } from './imgur/imgur.service';
import * as messageRules from './message-rules.json';
import { RollerShutterService } from './roller-shutter/roller-shutter.service';
import { StableDiffusionService } from './stable-diffusion/stable-diffusion.service';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);
  constructor(
    private readonly stableDiffusionService: StableDiffusionService,
    private readonly imgurService: ImgurService,
    private readonly rollerShutterService: RollerShutterService,
    private readonly mqttService: MqttService,
  ) {}
  async create(client: messagingApi.MessagingApiClient, event: MessageEvent) {
    try {
      // 整理設定檔訊息規則
      const rules = messageRules.map((rule) => ({
        type: rule.type,
        groupId: rule?.groupId,
        userId: rule?.userId,
        keyword: rule?.keyword,
        regexp: rule?.regexp,
        reply: rule?.reply,
        packageId: rule?.packageId,
        stickerId: rule?.stickerId,
        enable: rule.enable,
      }));
      // console.log(JSON.stringify(event, null, 2)); // 測試用
      // 群組 ID
      const groupId = _.get(event, 'source.groupId', '');
      // 使用者 ID
      const userId = _.get(event, 'source.userId', '');
      // 訊息文字
      const text = _.get(event, 'message.text', '');
      // 寫入 Log
      this.logger.log(`message: ${text}`);
      // 搜尋規則
      const rule = _.find(rules, (rule) => {
        // 指令是否啟用
        if (!rule.enable) {
          return false;
        }
        // 群組權限
        if (rule.groupId && rule.groupId.length > 0) {
          const isGroup = rule.groupId.includes(groupId);
          if (!isGroup) {
            return false;
          }
        }
        // 使用者權限
        if (rule.userId && rule.userId.length > 0) {
          const isUser = rule.userId.includes(userId);
          if (!isUser) {
            return false;
          }
        }
        if (rule.keyword) {
          if (Array.isArray(rule.keyword)) {
            return rule.keyword.includes(text);
          } else {
            return rule.keyword === text;
          }
        } else if (rule.regexp) {
          return new RegExp(rule.regexp).test(text);
        }
      });
      // 規則是否存在
      if (!rule) {
        return null;
      }
      // 一般訊息
      if (rule.type === 'text') {
        return client.replyMessage({
          replyToken: event.replyToken,
          messages: [
            {
              type: 'text',
              text: rule.reply,
            },
          ],
        });
      }
      // Stable Diffusion
      if (rule.type === 'stable-diffusion') {
        const prompt: string = text.substring(3);
        const base64Image = await this.stableDiffusionService.create(prompt);
        if (!base64Image) {
          return client.replyMessage({
            replyToken: event.replyToken,
            messages: [
              {
                type: 'text',
                text: 'Stable Diffusion offline.',
              },
            ],
          });
        }
        const url = await this.imgurService.create(base64Image);
        return client.replyMessage({
          replyToken: event.replyToken,
          messages: [
            {
              type: 'image',
              originalContentUrl: url,
              previewImageUrl: url,
            },
          ],
        });
      }
      // Roller Shutter
      if (rule.type === 'roller-shutter') {
        await this.rollerShutterService.create();
        return client.replyMessage({
          replyToken: event.replyToken,
          messages: [
            {
              type: 'text',
              text: '已送出鐵捲門開啟命令',
            },
          ],
        });
      }
      // Smart Home
      if (rule.type === 'smart-home') {
        return client.replyMessage({
          replyToken: event.replyToken,
          messages: [
            {
              type: 'flex',
              altText: 'Smart Home',
              contents: JSON.parse(JSON.stringify(flexRules['smart-home'])),
            },
          ],
        });
      }
      // Vacuum Start
      if (rule.type === 'vacuum-start') {
        this.mqttService.publish('vacuum/power/inTopic', 'start');
        return client.replyMessage({
          replyToken: event.replyToken,
          messages: [
            {
              type: 'text',
              text: '已送出掃地機開始清掃命令',
            },
          ],
        });
      }
      // Vacuum Return
      if (rule.type === 'vacuum-return') {
        this.mqttService.publish('vacuum/power/inTopic', 'return_to_base');
        return client.replyMessage({
          replyToken: event.replyToken,
          messages: [
            {
              type: 'text',
              text: '已送出掃地機開始回充命令',
            },
          ],
        });
      }
      // Fan on
      if (rule.type === 'duckfan-on') {
        this.mqttService.publish('duckfan/power/inTopic', '1');
        return client.replyMessage({
          replyToken: event.replyToken,
          messages: [
            {
              type: 'text',
              text: '已送出電風扇開啟命令',
            },
          ],
        });
      }
      // Fan off
      if (rule.type === 'duckfan-off') {
        this.mqttService.publish('duckfan/power/inTopic', '0');
        return client.replyMessage({
          replyToken: event.replyToken,
          messages: [
            {
              type: 'text',
              text: '已送出電風扇關閉命令',
            },
          ],
        });
      }
      // Night Light On
      if (rule.type === 'night-light-on') {
        this.mqttService.publish('lightboxy/switch/inTopic', '1');
        return client.replyMessage({
          replyToken: event.replyToken,
          messages: [
            {
              type: 'text',
              text: '已送出小夜燈開啟命令',
            },
          ],
        });
      }
      // Night Light Off
      if (rule.type === 'night-light-off') {
        this.mqttService.publish('lightboxy/switch/inTopic', '0');
        return client.replyMessage({
          replyToken: event.replyToken,
          messages: [
            {
              type: 'text',
              text: '已送出小夜燈關閉命令',
            },
          ],
        });
      }
      // Night Light Min
      if (rule.type === 'night-light-min') {
        this.mqttService.publish('lightboxy/brightness/inTopic', '1');
        return client.replyMessage({
          replyToken: event.replyToken,
          messages: [
            {
              type: 'text',
              text: '已送出小夜燈最暗命令',
            },
          ],
        });
      }
      // Night Light Max
      if (rule.type === 'night-light-max') {
        this.mqttService.publish('lightboxy/brightness/inTopic', '255');
        return client.replyMessage({
          replyToken: event.replyToken,
          messages: [
            {
              type: 'text',
              text: '已送出小夜燈最亮命令',
            },
          ],
        });
      }
      // Line 貼圖回覆
      if (rule.type === 'sticker') {
        // Probability
        if (Math.random() > 0.3) {
          return null;
        }
        return client.replyMessage({
          replyToken: event.replyToken,
          messages: [
            {
              type: 'sticker',
              packageId: rule.packageId,
              stickerId: rule.stickerId,
            },
          ],
        });
      }
      // Line Info tool
      if (rule.type === 'line-info') {
        const messages: messagingApi.Message[] = [
          {
            type: 'text',
            text: `userId：${userId}`,
          },
        ];
        if (groupId) {
          messages.push({
            type: 'text',
            text: `groupId：${groupId}`,
          });
        }
        return client.replyMessage({
          replyToken: event.replyToken,
          messages: messages,
        });
      }
      // Line sticker tool
      if (rule.type === 'line-sticker') {
        const keys = text.split(' ');
        return client.replyMessage({
          replyToken: event.replyToken,
          messages: [
            {
              type: 'sticker',
              packageId: keys[1],
              stickerId: keys[2],
            },
          ],
        });
      }
      // Line flex tool
      if (rule.type === 'line-flex') {
        const str = text.substring(5);
        try {
          const contents = JSON.parse(str);
          return client.replyMessage({
            replyToken: event.replyToken,
            messages: [
              {
                type: 'flex',
                altText: 'Line Flex',
                contents,
              },
            ],
          });
        } catch (e) {
          throw {
            ...e,
            error: {
              message: 'JSON Format Error.',
            },
          };
        }
      }
    } catch (e) {
      console.log(e);
      return client.replyMessage({
        replyToken: event.replyToken,
        messages: [
          {
            type: 'text',
            text: e?.error?.message || 'Server Error.',
          },
        ],
      });
    }
  }
}
