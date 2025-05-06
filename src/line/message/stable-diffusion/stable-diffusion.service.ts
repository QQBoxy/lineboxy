import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class StableDiffusionService {
  async create(prompt?: string): Promise<string> {
    try {
      const res = await axios({
        method: 'post',
        url: new URL(
          '/sdapi/v1/txt2img',
          process.env.STABLE_DIFFUSION_WEBUI_URL || 'http://127.0.0.1:7860',
        ).href,
        headers: { Authorization: process.env.IMGUR_CLIENT_ID },
        data: {
          prompt: prompt ?? '1girl',
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
      return res?.data?.images[0] || '';
    } catch (e) {
      return '';
    }
  }
}
