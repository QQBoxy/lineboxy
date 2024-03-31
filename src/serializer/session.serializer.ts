import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  serializeUser(user: any, done: (err: any, id?: any) => void): void {
    done(null, user ?? {});
  }

  async deserializeUser(payload: any, done: (err: any, id?: any) => void): Promise<void> {
    if (payload.googleId) {
      this.usersService.findOneByGoogleId(payload.googleId).then((user) => {
        done(null, user);
      });
    } else {
      done(null, {});
    }
  }
}
