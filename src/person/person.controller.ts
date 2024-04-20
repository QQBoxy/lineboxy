import { Controller, Get, Request } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from '../users/users.service';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { UserDto } from '../users/dto/user.dto';

@ApiCookieAuth()
@ApiTags('Person')
@Controller()
export class PersonController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get Personal Information' })
  @ApiResponse({ status: 200, description: 'Successful', type: UserDto })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @Roles(Role.Admin, Role.User)
  read(@Request() req) {
    const session: Session = req.session;
    return session.passport.user;
  }
}
