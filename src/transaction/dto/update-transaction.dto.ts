import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { TransactionDto } from './transaction.dto';

export class UpdateTransactionDto extends PickType(TransactionDto, ['name', 'price']) {
  @IsOptional()
  @ApiPropertyOptional({ description: 'Transaction Name', example: '漢堡' })
  name: string;

  @IsOptional()
  @ApiPropertyOptional({ description: 'Transaction Price', example: 120 })
  price: number;
}
