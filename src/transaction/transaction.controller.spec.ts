import { Test, TestingModule } from '@nestjs/testing';

import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

describe('TransactionController', () => {
  let controller: TransactionController;
  let transactionService: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
    getTotal: jest.Mock;
  };
  const req = {
    session: {
      passport: {
        user: {
          id: 1,
          name: 'qqboxy',
        },
      },
    },
  } as any;

  beforeEach(async () => {
    transactionService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      getTotal: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TransactionService,
          useValue: transactionService,
        },
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a transaction for the current user', () => {
    controller.create(req, { name: '漢堡', price: 120 });

    expect(transactionService.create).toHaveBeenCalledWith({
      name: '漢堡',
      price: 120,
      user: {
        id: 1,
        name: 'qqboxy',
      },
    });
  });

  it('should route CRUD calls to the service', () => {
    controller.findAll(req, { offset: 0, limit: 10 });
    controller.findOne(req, '1');
    controller.update(req, '1', { name: '咖啡', price: 80 });
    controller.remove(req, '1');

    expect(transactionService.findAll).toHaveBeenCalledWith(req, {
      offset: 0,
      limit: 10,
    });
    expect(transactionService.findOne).toHaveBeenCalledWith(req, 1);
    expect(transactionService.update).toHaveBeenCalledWith(req, 1, {
      name: '咖啡',
      price: 80,
    });
    expect(transactionService.remove).toHaveBeenCalledWith(req, 1);
  });

  it('should route getTotal call to the service', () => {
    controller.getTotal(req, { year: 2026 });
    expect(transactionService.getTotal).toHaveBeenCalledWith(req, 2026);
  });
});
