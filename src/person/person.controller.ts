import { Body, Controller, Get, Patch, Req } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { AuthenticatedRequest } from '../types/request';
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
  read(@Req() req: AuthenticatedRequest) {
    return req.user;
  }

  @Patch('line-user-ids')
  @ApiOperation({ summary: 'Update Personal Line User IDs' })
  @ApiResponse({ status: 200, description: 'Successful', type: UserDto })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @Roles(Role.Admin, Role.User)
  async updateLineIds(
    @Req() req: AuthenticatedRequest,
    @Body() updateLineIdsDto: UpdateLineUserIdsDto,
  ) {
    const user = await this.usersService.update(req.user.id, {
      lineUserIds: updateLineIdsDto.lineUserIds,
    });
    user.role = req.user.role;
    return user;
  }
}
