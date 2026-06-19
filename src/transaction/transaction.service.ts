import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Between, Repository } from 'typeorm';

import { User } from '../users/entities/user.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { FindTransactionDto } from './dto/find-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';

export type CreateTransactionInput = CreateTransactionDto & {
  user: User;
};

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async getTotal(req: Request, year?: number) {
    const targetYear = year ?? new Date().getFullYear();
    const startDate = new Date(targetYear, 0, 1, 0, 0, 0, 0);
    const endDate = new Date(targetYear, 11, 31, 23, 59, 59, 999);

    const transactions = await this.transactionRepository.find({
      where: {
        user: {
          id: req.session.passport.user.id,
        },
        createdAt: Between(startDate, endDate),
      },
      select: {
        price: true,
        createdAt: true,
      },
    });

    const monthlyTotals = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      total: 0,
    }));

    for (const transaction of transactions) {
      const monthIndex = new Date(transaction.createdAt).getMonth();
      monthlyTotals[monthIndex].total += transaction.price;
    }

    return monthlyTotals;
  }

  create(createTransactionDto: CreateTransactionInput) {
    const transaction = new Transaction();
    transaction.name = createTransactionDto.name;
    transaction.price = createTransactionDto.price;
    transaction.user = createTransactionDto.user;

    return this.transactionRepository.save(transaction);
  }

  async findAll(req: Request, findTransactionDto: FindTransactionDto) {
    const [data, total] = await this.transactionRepository.findAndCount({
      where: {
        user: {
          id: req.session.passport.user.id,
        },
      },
      relations: { user: true },
      order: {
        createdAt: 'DESC',
      },
      skip: findTransactionDto.offset || 0,
      take: findTransactionDto.limit || 10,
    });
    return {
      data,
      total,
    };
  }

  async findOne(req: Request, id: number) {
    const transaction = await this.transactionRepository.findOne({
      where: {
        id,
        user: {
          id: req.session.passport.user.id,
        },
      },
      relations: { user: true },
    });
    if (!transaction) {
      throw new NotFoundException();
    }
    return transaction;
  }

  async update(req: Request, id: number, updateTransactionDto: UpdateTransactionDto) {
    const transaction = await this.findOne(req, id);
    const newTransaction = new Transaction();

    if (updateTransactionDto.name !== undefined) {
      newTransaction.name = updateTransactionDto.name;
    }
    if (updateTransactionDto.price !== undefined) {
      newTransaction.price = updateTransactionDto.price;
    }
    newTransaction.updatedAt = new Date();

    await this.transactionRepository.update({ id: transaction.id }, newTransaction);
    return this.findOne(req, id);
  }

  async remove(req: Request, id: number) {
    const transaction = await this.findOne(req, id);
    return this.transactionRepository.delete(transaction.id);
  }
}
