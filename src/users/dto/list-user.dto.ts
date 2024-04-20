import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto';
import { instanceToPlain } from 'class-transformer';

export class ListUserDto {
  @ApiProperty({ example: 1 })
  public total: number;

  @ApiProperty({
    isArray: true,
    type: instanceToPlain(UserDto),
  })
  public data: Array<InstanceType<typeof UserDto>>;
}
