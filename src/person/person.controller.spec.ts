import { Test, TestingModule } from '@nestjs/testing';

import { Role } from '../enums/role.enum';
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

  it('should read the deserialized request user', () => {
    const user = { id: 1, name: 'qqboxy', role: Role.Admin };
    const req = { user } as any;

    expect(controller.read(req)).toBe(user);
  });

  it('should update personal line user IDs and preserve the effective role', async () => {
    const user = {
      id: 1,
      name: 'qqboxy',
      lineUserIds: ['line-user-id'],
      role: Role.User,
    };
    const req = {
      user: {
        id: 1,
        name: 'qqboxy',
        role: Role.Admin,
      },
    } as any;
    usersService.update.mockResolvedValue(user);

    await expect(
      controller.updateLineIds(req, { lineUserIds: ['line-user-id'] }),
    ).resolves.toEqual(user);

    expect(usersService.update).toHaveBeenCalledWith(1, {
      lineUserIds: ['line-user-id'],
    });
    expect(user.role).toBe(Role.Admin);
  });
});
