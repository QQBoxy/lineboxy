import { Request } from 'express';
import { Profile } from 'passport-google-oauth20';

import { User } from '../users/entities/user.entity';

export type AuthenticatedRequest = Request & {
  user: User;
};

export type GoogleOAuthRequest = Request & {
  user?: {
    accessToken: string;
    refreshToken: string;
    profile: Profile;
  };
};
