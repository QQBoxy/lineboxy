import { Injectable } from '@nestjs/common';
import { Client, MessageEvent } from '@line/bot-sdk';
import axios from 'axios';
import * as _ from 'lodash';
import * as messageRules from './message-rules.json';

@Injectable()
export class MessageService {
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
        enable: false,
      }));
      // 群組 ID
      const groupId = _.get(event, 'source.groupId', '');
      // 使用者 ID
      const userId = _.get(event, 'source.userId', '');
      // 訊息文字
      const text = _.get(event, 'message.text', '');
      // 搜尋規則
      const rule = _.find(rules, (rule) => {
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
        let resSD;
        try {
          resSD = await axios({
            method: 'post',
            url: 'http://127.0.0.1:7860/sdapi/v1/txt2img',
            headers: { Authorization: process.env.IMGUR_CLIENT_ID },
            data: {
              prompt: '1girl',
              negative_prompt:
                '!,bad_prompt_version2,  ng_deepnegative_v1_75t, easynegative, (low quality:1.4), (worst quality), signature, watermark, username, blurry, artist name, trademark, watermark',
              steps: 20,
              width: 512,
              height: 512,
              cfg_scale: 7,
              seed: -1,
              sampler_name: 'DPM++ 2M Karras',
            },
          });
        } catch (e) {
          return client.replyMessage(event.replyToken, {
            type: 'text',
            text: 'Stable Diffusion offline.',
          });
        }

        const base64Image = resSD.data.images[0];

        const imgur: any = await axios({
          method: 'post',
          url: 'https://api.imgur.com/3/image',
          headers: {
            Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
          },
          data: {
            image: base64Image,
          },
        });

        const url = imgur.data.data.link;

        return client.replyMessage(event.replyToken, {
          type: 'image',
          originalContentUrl: url,
          previewImageUrl: url,
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
