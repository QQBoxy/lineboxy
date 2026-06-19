import { PickType } from '@nestjs/swagger';

import { TransactionDto } from './transaction.dto';

export class CreateTransactionDto extends PickType(TransactionDto, ['name', 'price']) {}
