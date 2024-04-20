import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

import { Role } from '../../enums/role.enum';

export class UserDto {
  @IsInt()
  @ApiProperty({ description: 'User ID', example: 1 })
  id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Google ID', example: '000000000000000000001' })
  googleId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'User Name', example: 'QQBoxy' })
  name: string;

  @IsString()
  @ApiProperty({ description: 'User EMail', example: 'admin@qqboxy.com' })
  email: string;

  @IsString()
  @ApiProperty({ description: 'User Picture', example: 'https://qqboxy.com/avatar.jpg' })
  picture: string;

  @IsString()
  @ApiProperty({
    description: 'User Role',
    enum: Role,
    example: Role.User,
  })
  role: string;
}
