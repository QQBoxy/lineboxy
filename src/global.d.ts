import 'express';
import 'express-session';

import { Profile } from '@types/passport-google-oauth20';

declare module 'express' {
  interface User {
    accessToken: string;
    refreshToken: string;
    profile: Profile;
  }

  interface Request {
    user?: User;
  }
}

declare module 'express-session' {
  interface SessionData {
    oauth_redirect_uri?: string;
    oauth_state?: string;
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
