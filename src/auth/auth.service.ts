import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(req): Promise<any> {
    if (!req.user) {
      return 'No user from google';
    }
    const { googleId } = req.user;
    // 取得帳號資訊
    let user = await this.usersService.findOneByGoogleId(googleId);

    // 帳號不存在就建立
    if (!user) {
      user = await this.usersService.create({
        googleId: req.user.googleId,
        name: req.user.name,
        picture: req.user.picture,
      });
    }

    // 寫入 Session
    req.session.userId = user.id;

    return {
      message: 'User information from google',
      user: user,
    };
  }
}
