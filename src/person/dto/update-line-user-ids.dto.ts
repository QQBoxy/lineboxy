import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class UpdateLineUserIdsDto {
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    description: 'Line User IDs',
    example: ['U79a5a8ac14782598e917d4e23c3e2a4b'],
  })
  lineUserIds: string[];
}
