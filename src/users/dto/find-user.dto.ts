import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

export class FindUserDto {
  @IsInt()
  @IsOptional()
  @ApiProperty({ description: 'Offset', example: 0 })
  offset: number;

  @IsInt()
  @IsOptional()
  @ApiProperty({ description: 'Limit', example: 10 })
  limit: number;
}
