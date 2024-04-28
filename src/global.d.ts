import { Profile } from '@types/passport-google-oauth20';
import { Session as ExpressSession } from 'express-session';

interface Session extends ExpressSession {
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

declare global {
  interface Request extends Express.Request {
    session: Session;
    user?: {
      accessToken: string;
      refreshToken: string;
      profile: Profile;
    };
  }
}
