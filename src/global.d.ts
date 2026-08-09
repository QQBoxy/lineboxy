import 'express';
import 'express-session';

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
        lineUserIds?: string[];
      };
    };
  }
}
