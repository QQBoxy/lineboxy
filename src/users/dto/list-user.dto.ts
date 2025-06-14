import { ApiProperty } from '@nestjs/swagger';

import { UserDto } from './user.dto';

export class ListUserDto {
  @ApiProperty({
    isArray: true,
    type: UserDto,
    enumName: 'UserDto',
  })
  public data: Array<UserDto>;

  @ApiProperty({ example: 1 })
  public total: number;
}
