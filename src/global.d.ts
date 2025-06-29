import 'express';
import 'express-session';

import { Profile } from '@types/passport-google-oauth20';

export declare module 'express' {
  interface GoogleOAuthUser {
    accessToken: string;
    refreshToken: string;
    profile: Profile;
  }
  interface Request {
    user?: GoogleOAuthUser;
  }
}

declare module 'express-session' {
  interface SessionData {
    oauth?: {
      redirect_uri: string;
    };
    passport?: {
      user: {
        id: number;
        googleId: string;
        name: string;
        email: string;
        picture: string;
        role: string;
      };
    };
  }
}
