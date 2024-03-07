import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ServiceHeartbeatService {
  private readonly logger = new Logger(ServiceHeartbeatService.name);

  check(url: string) {
    axios({
      method: 'get',
      url: url,
    }).catch((error) => {
      this.logger.error(error);
    });
  }
}
