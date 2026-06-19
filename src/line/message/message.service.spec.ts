import { Test, TestingModule } from '@nestjs/testing';

import { MqttService } from '../../mqtt/mqtt.service';
import { ExpenseService } from './expense/expense.service';
import { ImgurService } from './imgur/imgur.service';
import { MessageService } from './message.service';
import { RollerShutterService } from './roller-shutter/roller-shutter.service';
import { StableDiffusionService } from './stable-diffusion/stable-diffusion.service';

describe('MessageService', () => {
  let service: MessageService;
  let expenseService: { create: jest.Mock };

  beforeEach(async () => {
    expenseService = {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      create: jest.fn(async (_text: string, _userId: string) => ({
        id: 1,
        name: '漢堡',
        price: 100,
        user: {
          id: 1,
          name: 'qqboxy',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageService,
        {
          provide: StableDiffusionService,
          useValue: {},
        },
        {
          provide: ImgurService,
          useValue: {},
        },
        {
          provide: RollerShutterService,
          useValue: {},
        },
        {
          provide: MqttService,
          useValue: {
            publish: jest.fn(),
          },
        },
        {
          provide: ExpenseService,
          useValue: expenseService,
        },
      ],
    }).compile();

    service = module.get<MessageService>(MessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an expense record and reply with confirmation', async () => {
    const client = {
      replyMessage: jest.fn(),
    };
    const event = {
      replyToken: 'reply-token',
      source: {
        userId: 'U79a5a8ac14782598e917d4e23c3e2a4b',
      },
      message: {
        text: '記帳 漢堡 一百',
      },
    };

    await service.create(client as any, event as any);

    expect(expenseService.create).toHaveBeenCalledWith(
      '記帳 漢堡 一百',
      'U79a5a8ac14782598e917d4e23c3e2a4b',
    );
    expect(client.replyMessage).toHaveBeenCalledWith({
      replyToken: 'reply-token',
      messages: [
        {
          type: 'text',
          text: '已記帳：漢堡 $100（qqboxy）',
        },
      ],
    });
  });

  it('should route expense record authorization to ExpenseService', async () => {
    const client = {
      replyMessage: jest.fn(),
    };
    const event = {
      replyToken: 'reply-token',
      source: {
        userId: 'unknown',
      },
      message: {
        text: '記帳 漢堡 一百',
      },
    };

    await service.create(client as any, event as any);

    expect(expenseService.create).toHaveBeenCalledWith('記帳 漢堡 一百', 'unknown');
  });
});
