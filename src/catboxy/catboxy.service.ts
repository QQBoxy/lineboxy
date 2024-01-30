import { Injectable } from '@nestjs/common';

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(() => resolve(), ms));
}

@Injectable()
export class CatboxyService {
  constructor() {
    // ...
  }
  async create(ms: number) {
    await delay(ms > 60000 ? 60000 : ms);
    return {};
  }
  async read(ms: number) {
    await delay(ms > 60000 ? 60000 : ms);
    return {};
  }
}
