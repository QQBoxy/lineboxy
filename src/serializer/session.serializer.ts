import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportSerializer } from '@nestjs/passport';

import { Role } from '../enums/role.enum';
import { UsersService } from '../users/users.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  serializeUser(user: any, done: (err: any, id?: any) => void): void {
    done(null, user ?? {});
  }

  async deserializeUser(payload: any, done: (err: any, id?: any) => void): Promise<void> {
    if (payload.id) {
      this.usersService.findOne(payload.id).then((user) => {
        if (user) {
          const adminEmail = this.configService
            .get<string>('ADMIN_EMAIL', '')
            .trim()
            .toLowerCase();
          if (adminEmail.length > 0 && user.email === adminEmail) {
            user.role = Role.Admin;
          }
        }
        done(null, user);
      });
    } else {
      done(null, {});
    }
  }
}
