import { Controller, Get, Query, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { GoogleOAuthGuard } from '../guards/google-oauth.guard';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @ApiOperation({
    summary: 'Initialize Google OAuth 2.0 sign-in flow',
    description:
      'Stores redirect parameters in cookies and returns a redirect URL (`/auth/google`) to initiate the Google OAuth sign-in process.',
  })
  async authorize(
    @Query('redirect_uri') redirectUri: string,
    @Query('state') state: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    // TODO: session
    // req.session.oauth_redirect_uri = redirectUri;
    // req.session.oauth_state = state;
    return res.redirect('/auth/google');
  }

  @Get('google')
  @ApiOperation({
    summary: 'Sign in with Google OAuth 2.0',
    description:
      'Redirects the user to the Google login page for authentication, then returns to the callback URL (`/auth/google-redirect`) after verification.',
  })
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {
    // ...
  }

  @Get('google-redirect')
  @ApiOperation({
    summary: 'Google OAuth 2.0 callback URL',
    description: 'Redirect to login page with status code.',
  })
  @ApiResponse({
    status: 200,
    description: 'Redirect to `/login?code=SUCCESSFUL`',
  })
  @ApiResponse({
    status: 401,
    description:
      'Redirect to verification failed page: `/login?code=NO_USER_FROM_GOOGLE` , `/login?code=EMAIL_ADDRESS_IS_NOT_VERIFIED`',
    schema: {
      anyOf: [
        {
          description: 'Redirect to `/login?code=NO_USER_FROM_GOOGLE`',
          example: {
            code: 'NO_USER_FROM_GOOGLE',
          },
        },
        {
          description: 'Redirect to `/login?code=EMAIL_ADDRESS_IS_NOT_VERIFIED`',
          example: {
            code: 'EMAIL_ADDRESS_IS_NOT_VERIFIED',
          },
        },
      ],
    },
  })
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const result = await this.authService.validateUser(req);
    return res.redirect(result.redirect_uri);
  }

  @Get('logout')
  @ApiOperation({
    summary: 'Google OAuth 2.0 logout',
    description: 'Redirect to logout page with status code.',
  })
  @ApiResponse({ status: 200, description: 'Redirect to `/logout?code=SUCCESSFUL`' })
  @Redirect('/', 302)
  async googleAuthLogout(@Req() req: Request) {
    await new Promise<void>((resolve) => {
      req.logout(resolve);
    });
    await new Promise<void>((resolve) => {
      req.session.destroy(resolve);
    });
    return { url: '/logout?code=SUCCESSFUL' };
  }
}
