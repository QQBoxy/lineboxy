import { GoogleOAuthGuard } from '../guards/google-oauth.guard';
import { Controller, Get, Request, UseGuards, Redirect } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags, ApiExcludeEndpoint } from '@nestjs/swagger';

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
  async googleAuthLogout(@Request() req) {
    await new Promise<void>((resolve) => {
      req.logout(() => {
        resolve();
      });
    });
    req.session.destroy();
    return { url: '/logout?code=SUCCESSFUL' };
  }
}
