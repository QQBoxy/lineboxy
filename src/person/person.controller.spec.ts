import { Test, TestingModule } from '@nestjs/testing';

import { UsersService } from '../users/users.service';
import { PersonController } from './person.controller';

describe('PersonController', () => {
  let controller: PersonController;
  let usersService: { update: jest.Mock };

  beforeEach(async () => {
    usersService = {
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonController],
      providers: [
        {
          provide: UsersService,
          useValue: usersService,
        },
      ],
    }).compile();

    controller = module.get<PersonController>(PersonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should update personal line user IDs and session user', async () => {
    const user = {
      id: 1,
      name: 'qqboxy',
      lineUserIds: ['line-user-id'],
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
    usersService.update.mockResolvedValue(user);

    await expect(
      controller.updateLineIds(req, { lineUserIds: ['line-user-id'] }),
    ).resolves.toEqual(user);

    expect(usersService.update).toHaveBeenCalledWith(1, {
      lineUserIds: ['line-user-id'],
    });
    expect(req.session.passport.user).toEqual(user);
  });
});
