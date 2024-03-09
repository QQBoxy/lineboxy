import { PartialType } from '@nestjs/mapped-types';
import { IsString, MinLength } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  account: string;

  @IsString()
  @MinLength(6)
  password: string;
}
