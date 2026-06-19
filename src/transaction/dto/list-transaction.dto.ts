import { ApiProperty } from '@nestjs/swagger';

import { TransactionDto } from './transaction.dto';

export class ListTransactionDto {
  @ApiProperty({
    isArray: true,
    type: TransactionDto,
    enumName: 'TransactionDto',
  })
  public data: Array<TransactionDto>;

  @ApiProperty({ example: 1 })
  public total: number;
}
