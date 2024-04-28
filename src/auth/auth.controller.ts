import { Controller, Get, Redirect, Request, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GoogleOAuthGuard } from '../guards/google-oauth.guard';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @ApiOperation({
    summary: 'Sign in with Google OAuth 2.0',
    description:
      'The page redirects to the Google login page for verification. After verification, redirect to callback url (`/auth/google-redirect`) .',
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
  @Redirect('/', 302)
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(@Request() req) {
    const result = await this.authService.validateUser(req);
    return { url: result.redirect_uri };
  }

  @Get('logout')
  @ApiOperation({
    summary: 'Google OAuth 2.0 logout',
    description: 'Redirect to logout page with status code.',
  })
  @ApiResponse({ status: 200, description: 'Redirect to `/logout?code=SUCCESSFUL`' })
  @Redirect('/', 302)
  async googleAuthLogout(@Request() req: Request) {
    await new Promise<void>((resolve) => {
      req.logout(resolve);
    });
    await new Promise<void>((resolve) => {
      req.session.destroy(resolve);
    });
    return { url: '/logout?code=SUCCESSFUL' };
  }
}
