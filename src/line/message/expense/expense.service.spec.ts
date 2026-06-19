import { Test, TestingModule } from '@nestjs/testing';

import { TransactionService } from '../../../transaction/transaction.service';
import { UsersService } from '../../../users/users.service';
import { ExpenseService } from './expense.service';

describe('ExpenseService', () => {
  let service: ExpenseService;
  let transactionService: { create: jest.Mock };
  let usersService: { findOneByLineUserId: jest.Mock };
  const qqboxy = {
    id: 1,
    name: 'qqboxy',
    lineUserIds: ['U79a5a8ac14782598e917d4e23c3e2a4b'],
  };
  const catboxy = {
    id: 2,
    name: 'catboxy',
    lineUserIds: ['U4b5d99bec0e1b9fd80b6dd6bf8b2915a'],
  };

  beforeEach(async () => {
    transactionService = {
      create: jest.fn(async (transaction) => transaction),
    };
    usersService = {
      findOneByLineUserId: jest.fn(async (lineUserId: string) => {
        if (lineUserId === 'U79a5a8ac14782598e917d4e23c3e2a4b') {
          return qqboxy;
        }
        if (lineUserId === 'U4b5d99bec0e1b9fd80b6dd6bf8b2915a') {
          return catboxy;
        }
        return null;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpenseService,
        {
          provide: TransactionService,
          useValue: transactionService,
        },
        {
          provide: UsersService,
          useValue: usersService,
        },
      ],
    }).compile();

    service = module.get<ExpenseService>(ExpenseService);
  });

  it('should record a numeric price', async () => {
    await service.create('記帳 漢堡 120', 'U79a5a8ac14782598e917d4e23c3e2a4b');

    expect(transactionService.create).toHaveBeenCalledWith({
      name: '漢堡',
      price: 120,
      user: qqboxy,
    });
  });

  it.each([
    ['記帳 漢堡 一百', 100],
    ['記帳 麥當勞 一百三', 130],
    ['記帳 麥當勞 一百零三', 103],
    ['記帳 漢堡 兩百', 200],
    ['記帳 午餐 一百二十', 120],
    ['記帳 早餐 一千二', 1200],
    ['記帳 早餐 一千零二', 1002],
    ['記帳 早餐 一千兩百三', 1230],
    ['記帳 午餐 一千兩百三十四', 1234],
    ['記 麵包 三十五', 35],
    ['帳 咖啡 一萬二', 12000],
    ['帳 咖啡 一萬零二', 10002],
    ['帳 咖啡 一萬零三十', 10030],
  ])('should record a traditional Chinese price: %s', async (text, price) => {
    await service.create(text, 'U4b5d99bec0e1b9fd80b6dd6bf8b2915a');

    expect(transactionService.create).toHaveBeenCalledWith(
      expect.objectContaining({
        price,
        user: catboxy,
      }),
    );
  });

  it.each(['記帳 漢堡 120元', '記帳 漢堡 共花120元'])(
    'should reject mixed price text: %s',
    async (text) => {
      await expect(
        service.create(text, 'U79a5a8ac14782598e917d4e23c3e2a4b'),
      ).rejects.toThrow('記帳格式錯誤');

      expect(transactionService.create).not.toHaveBeenCalled();
    },
  );

  it('should reject an unknown Line user', async () => {
    await expect(service.create('記帳 漢堡 120', 'unknown')).rejects.toThrow(
      'Unknown Line user.',
    );

    expect(transactionService.create).not.toHaveBeenCalled();
  });
});
