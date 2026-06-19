import { Body, Controller, Get, Patch, Req } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { UserDto } from '../users/dto/user.dto';
import { UsersService } from '../users/users.service';
import { UpdateLineUserIdsDto } from './dto/update-line-user-ids.dto';

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

  @Patch('line-user-ids')
  @ApiOperation({ summary: 'Update Personal Line User IDs' })
  @ApiResponse({ status: 200, description: 'Successful', type: UserDto })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @Roles(Role.Admin, Role.User)
  async updateLineIds(
    @Req() req: Request,
    @Body() updateLineIdsDto: UpdateLineUserIdsDto,
  ) {
    const user = await this.usersService.update(req.session.passport.user.id, {
      lineUserIds: updateLineIdsDto.lineUserIds,
    });
    req.session.passport.user = user;
    return user;
  }
}
