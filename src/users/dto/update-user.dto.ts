import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';

import { Role } from '../../enums/role.enum';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsEnum(Role)
  @IsOptional()
  @ApiProperty({
    description: 'User role',
    enum: Role,
    example: Role.Admin,
  })
  role?: Role;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'User picture URL',
  })
  picture?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ApiProperty({
    description: 'Line User IDs',
    example: ['U79a5a8ac14782598e917d4e23c3e2a4b'],
  })
  lineUserIds?: string[];
}
