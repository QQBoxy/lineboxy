import { ApiProperty } from '@nestjs/swagger';
import { instanceToPlain } from 'class-transformer';

import { UserDto } from './user.dto';

export class ListUserDto {
  @ApiProperty({ example: 1 })
  public total: number;

  @ApiProperty({
    isArray: true,
    type: instanceToPlain(UserDto),
  })
  public data: Array<InstanceType<typeof UserDto>>;
}
