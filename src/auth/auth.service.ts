import { Injectable } from '@nestjs/common';

import { Role } from '../enums/role.enum';
import { UsersService } from '../users/users.service';

interface Redirect {
  message: string;
  redirect_uri: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(req: Request): Promise<Redirect> {
    if (!req.user) {
      return {
        message: 'No user from google',
        redirect_uri: '/login?code=NO_USER_FROM_GOOGLE',
      };
    }
    // Google OAuth 2.0
    const {
      sub: googleId,
      name,
      email,
      email_verified,
      picture,
    } = req.user.profile._json;
    // 驗證信箱
    if (!email_verified) {
      return {
        message: 'Email Address is Not Verified',
        redirect_uri: '/login?code=EMAIL_ADDRESS_IS_NOT_VERIFIED',
      };
    }
    // 取得帳號資訊
    let user = await this.usersService.findOneByGoogleId(googleId);
    // 帳號不存在就建立
    if (!user) {
      user = await this.usersService.create({
        googleId: googleId,
        name: name,
        email: email,
        picture: picture,
        role: Role.User,
      });
    }
    // 寫入 Session
    req.session.passport = { user };
    // 響應
    return {
      message: 'User information from google',
      redirect_uri: '/login?code=SUCCESSFUL',
    };
  }
}
