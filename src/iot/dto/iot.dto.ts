import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class IotDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Topic', example: 'duckfan%2Fpower%2FinTopic' })
  topic: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Message', example: '1' })
  message: string;
}
