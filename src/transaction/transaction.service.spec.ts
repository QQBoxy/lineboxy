import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Role } from '../enums/role.enum';
import { Transaction } from './entities/transaction.entity';
import { TransactionService } from './transaction.service';

describe('TransactionService', () => {
  let service: TransactionService;
  let repository: {
    save: jest.Mock;
    findAndCount: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
    find: jest.Mock;
  };
  const req = {
    user: {
      id: 1,
      name: 'qqboxy',
      role: Role.User,
    },
  } as any;
  const adminReq = {
    user: {
      id: 2,
      name: 'admin',
      role: Role.Admin,
    },
  } as any;
  const user = {
    id: 1,
    name: 'qqboxy',
  } as any;

  beforeEach(async () => {
    repository = {
      save: jest.fn(async (transaction: Transaction) => transaction),
      findAndCount: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
  });

  it('should create a transaction', async () => {
    const transaction = await service.create({
      name: '漢堡',
      price: 120,
      user,
    });

    expect(repository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        name: '漢堡',
        price: 120,
        user,
      }),
    );
    expect(transaction).toEqual(
      expect.objectContaining({
        name: '漢堡',
        price: 120,
        user,
      }),
    );
  });

  it('should list transaction for the current user', async () => {
    repository.findAndCount.mockResolvedValue([[{ id: 1 }], 1]);

    await expect(service.findAll(req, { offset: 5, limit: 20 })).resolves.toEqual({
      data: [{ id: 1 }],
      total: 1,
    });

    expect(repository.findAndCount).toHaveBeenCalledWith({
      where: {
        user: {
          id: 1,
        },
      },
      relations: { user: true },
      order: {
        createdAt: 'DESC',
      },
      skip: 5,
      take: 20,
    });
  });

  it('should list all transactions for an admin', async () => {
    repository.findAndCount.mockResolvedValue([[{ id: 1 }, { id: 2 }], 2]);

    await service.findAll(adminReq, { offset: 0, limit: 10 });

    expect(repository.findAndCount).toHaveBeenCalledWith({
      where: {},
      relations: { user: true },
      order: {
        createdAt: 'DESC',
      },
      skip: 0,
      take: 10,
    });
  });

  it('should get one transaction for the current user', async () => {
    repository.findOne.mockResolvedValue({ id: 1, user });

    await expect(service.findOne(req, 1)).resolves.toEqual({
      id: 1,
      user,
    });

    expect(repository.findOne).toHaveBeenCalledWith({
      where: {
        id: 1,
        user: {
          id: 1,
        },
      },
      relations: { user: true },
    });
  });

  it('should reject transaction outside the current user', async () => {
    repository.findOne.mockResolvedValue(null);

    await expect(service.findOne(req, 1)).rejects.toThrow();
  });

  it('should get any transaction for an admin', async () => {
    repository.findOne.mockResolvedValue({ id: 1, user });

    await service.findOne(adminReq, 1);

    expect(repository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: { user: true },
    });
  });

  it('should update a transaction for the current user', async () => {
    repository.findOne
      .mockResolvedValueOnce({ id: 1, user })
      .mockResolvedValueOnce({ id: 1, name: '咖啡', price: 80, user });
    repository.update.mockResolvedValue({ affected: 1 });

    await expect(service.update(req, 1, { name: '咖啡', price: 80 })).resolves.toEqual({
      id: 1,
      name: '咖啡',
      price: 80,
      user,
    });

    expect(repository.update).toHaveBeenCalledWith(
      { id: 1 },
      expect.objectContaining({
        name: '咖啡',
        price: 80,
      }),
    );
  });

  it('should delete a transaction for the current user', async () => {
    repository.findOne.mockResolvedValue({ id: 1, user });
    repository.delete.mockResolvedValue({ affected: 1 });

    await expect(service.remove(req, 1)).resolves.toEqual({ affected: 1 });

    expect(repository.delete).toHaveBeenCalledWith(1);
  });

  describe('getTotal', () => {
    it('should get monthly totals for a specific year', async () => {
      const mockTransactions = [
        { price: 100, createdAt: new Date(2026, 0, 15) },
        { price: 200, createdAt: new Date(2026, 0, 20) },
        { price: 300, createdAt: new Date(2026, 5, 5) },
      ] as Transaction[];

      repository.find.mockResolvedValue(mockTransactions);

      const result = await service.getTotal(req, 2026);

      expect(repository.find).toHaveBeenCalledWith({
        where: {
          user: {
            id: 1,
          },
          createdAt: expect.any(Object),
        },
        select: {
          price: true,
          createdAt: true,
        },
      });

      expect(result[0]).toEqual({ month: 1, total: 300 });
      expect(result[5]).toEqual({ month: 6, total: 300 });
      expect(result[11]).toEqual({ month: 12, total: 0 });
      expect(result.length).toBe(12);
    });

    it('should fallback to current year if no year is provided', async () => {
      repository.find.mockResolvedValue([]);

      const result = await service.getTotal(req);

      expect(repository.find).toHaveBeenCalledWith({
        where: {
          user: {
            id: 1,
          },
          createdAt: expect.any(Object),
        },
        select: {
          price: true,
          createdAt: true,
        },
      });
      expect(result.length).toBe(12);
      expect(result.every((r) => r.total === 0)).toBe(true);
    });

    it('should calculate totals across all users for an admin', async () => {
      repository.find.mockResolvedValue([]);

      await service.getTotal(adminReq, 2026);

      expect(repository.find).toHaveBeenCalledWith({
        where: {
          createdAt: expect.any(Object),
        },
        select: {
          price: true,
          createdAt: true,
        },
      });
    });
  });
});
