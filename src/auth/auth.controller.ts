import { GoogleOAuthGuard } from '../guards/google-oauth.guard';
import { Controller, Get, Request, UseGuards, Redirect } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @ApiOperation({ summary: 'Sign in with Google OAuth 2.0' })
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {
    // ...
  }

  @Get('google-redirect')
  @ApiOperation({ summary: 'Google OAuth 2.0 callback URL' })
  @ApiResponse({ status: 200, description: "Redirect to '/login?code=SUCCESSFUL'" })
  @Redirect('/', 302)
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(@Request() req) {
    const result = await this.authService.validateUser(req);
    return { url: result.redirect_uri };
  }

  @Get('logout')
  @ApiOperation({ summary: 'Google OAuth 2.0 logout' })
  @ApiResponse({ status: 200, description: "Redirect to '/logout?code=SUCCESSFUL'" })
  @Redirect('/', 302)
  async googleAuthLogout(@Request() req) {
    await (() => {
      return new Promise((resolve) => {
        req.logout(() => {
          resolve('');
        });
      });
    })();
    req.session.destroy();
    return { url: '/logout?code=SUCCESSFUL' };
  }
}
