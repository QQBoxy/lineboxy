import { Injectable, Logger } from '@nestjs/common';

import { Role } from '../enums/role.enum';
import { GoogleOAuthRequest } from '../types/request';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(private readonly usersService: UsersService) {}

  async validateUser(req: GoogleOAuthRequest) {
    if (!req.user) {
      return { redirect_uri: '/login?code=NO_USER_FROM_GOOGLE' };
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
      return { redirect_uri: '/login?code=EMAIL_ADDRESS_IS_NOT_VERIFIED' };
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
    req.session.passport = { user };
    const redirect_uri = req.session.oauth?.redirect_uri ?? '/login?code=SUCCESSFUL';
    this.logger.log(`redirect_uri: ${redirect_uri}`);
    return {
      redirect_uri,
    };
  }
}
