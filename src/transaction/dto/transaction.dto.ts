import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

import { UserDto } from '../../users/dto/user.dto';

export class TransactionDto {
  @IsInt()
  @ApiProperty({ description: 'Transaction ID', example: 1 })
  id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Transaction Name', example: '漢堡' })
  name: string;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  @ApiProperty({ description: 'Transaction Price', example: 120 })
  price: number;

  @ApiProperty({ description: 'Transaction Owner', type: UserDto })
  user: UserDto;

  @ApiProperty({ example: '2024-03-31T11:15:12.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-03-31T11:15:12.000Z' })
  updatedAt: Date;
}
