import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Profile } from 'passport-google-oauth20';
import { Role } from '../enums/role.enum';

interface User {
  accessToken: string;
  refreshToken: string;
  profile: Profile;
}

interface Redirect {
  message: string;
  redirect_uri: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(req: { user: User; session: Session }): Promise<Redirect> {
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
      picture,
      email_verified,
      email,
    } = req.user.profile._json;
    // 取得帳號資訊
    let user = await this.usersService.findOneByGoogleId(googleId);
    if (!email_verified) {
      return {
        message: 'Email Address is Not Verified',
        redirect_uri: '/login?code=EMAIL_ADDRESS_IS_NOT_VERIFIED',
      };
    }
    // 帳號不存在就建立
    if (!user) {
      user = await this.usersService.create({
        googleId: googleId,
        name: name,
        picture: picture,
        email: email,
      });
    }
    // 寫入 Session
    req.session.userId = user.id;
    req.session.roles = [Role.User];
    return {
      message: 'User information from google',
      redirect_uri: '/login?code=SUCCESSFUL',
    };
  }
}
