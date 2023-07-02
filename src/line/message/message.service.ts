import { Injectable } from '@nestjs/common';
import { Client, MessageEvent } from '@line/bot-sdk';
import axios from 'axios';

@Injectable()
export class MessageService {
  async create(client, event: MessageEvent) {
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
}
