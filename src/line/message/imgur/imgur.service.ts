import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ImgurService {
  async create(base64Image: string): Promise<string> {
    try {
      const res = await axios({
        method: 'post',
        url: 'https://api.imgur.com/3/image',
        headers: {
          Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
        },
        data: {
          image: base64Image,
        },
      });
      return res?.data?.data?.link || '';
    } catch (e) {
      return '';
    }
  }
}
