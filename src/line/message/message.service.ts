import { Injectable } from '@nestjs/common';
import { Client, MessageEvent } from '@line/bot-sdk';
import axios from 'axios';
import * as _ from 'lodash';
import * as messageRules from './message-rules.json';
import { StableDiffusionService } from './stable-diffusion/stable-diffusion.service';
import { ImgurService } from './imgur/imgur.service';

@Injectable()
export class MessageService {
  constructor(
    private readonly stableDiffusionService: StableDiffusionService,
    private readonly imgurService: ImgurService,
  ) {}
  async create(client, event: MessageEvent) {
    try {
      // 整理設定檔訊息規則
      const rules = messageRules.map((rule) => ({
        type: rule.type,
        groupId: rule?.groupId,
        userId: rule?.userId,
        keyword: rule?.keyword,
        regexp: rule?.regexp,
        reply: rule?.reply,
        enable: rule.enable,
      }));
      // console.log(JSON.stringify(event, null, 2)); // 測試用
      // 群組 ID
      const groupId = _.get(event, 'source.groupId', '');
      // 使用者 ID
      const userId = _.get(event, 'source.userId', '');
      // 訊息文字
      const text = _.get(event, 'message.text', '');
      // 搜尋規則
      const rule = _.find(rules, (rule) => {
        // 指令是否啟用
        if (!rule.enable) {
          return null;
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
      // 群組權限
      if (rule.groupId && rule.groupId.length > 0) {
        const isGroup = rule.groupId.includes(groupId);
        if (!isGroup) {
          return null;
        }
      }
      // 使用者權限
      if (rule.userId && rule.userId.length > 0) {
        const isUser = rule.groupId.includes(userId);
        if (!isUser) {
          return null;
        }
      }
      // 一般訊息
      if (rule.type === 'text') {
        return client.replyMessage(event.replyToken, {
          type: 'text',
          text: rule.reply,
        });
      }
      // Stable Diffusion
      if (rule.type === 'stable-diffusion') {
        const base64Image = await this.stableDiffusionService.create();
        if (!base64Image) {
          return client.replyMessage(event.replyToken, {
            type: 'text',
            text: 'Stable Diffusion offline.',
          });
        }
        const url = await this.imgurService.create(base64Image);
        return client.replyMessage(event.replyToken, {
          type: 'image',
          originalContentUrl: url,
          previewImageUrl: url,
        });
      }
      // Line Info
      if (rule.type === 'line-info') {
        const messages = [
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
        return client.replyMessage(event.replyToken, messages);
      }
      // Line sticker
      if (rule.type === 'sticker') {
        const keys = text.split(' ');
        return client.replyMessage(event.replyToken, {
          type: 'sticker',
          packageId: keys[1],
          stickerId: keys[2],
        });
      }
    } catch (e) {
      console.log(e);
      return client.replyMessage(event.replyToken, {
        type: 'text',
        text: e?.error?.message || 'Server Error.',
      });
    }
  }
}
