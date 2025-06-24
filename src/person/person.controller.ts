import { Controller, Get, Req } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { UserDto } from '../users/dto/user.dto';
import { UsersService } from '../users/users.service';

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
  read(@Req() req: Request) {
    return req.session.passport.user;
  }
}
