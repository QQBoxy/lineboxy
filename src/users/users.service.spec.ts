import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Role } from '../enums/role.enum';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let repository: {
    save: jest.Mock;
    findAndCount: jest.Mock;
    findOneBy: jest.Mock;
    find: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };

  beforeEach(async () => {
    repository = {
      save: jest.fn(async (user: User) => user),
      findAndCount: jest.fn(),
      findOneBy: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should default lineUserIds when creating a user', async () => {
    await service.create({
      googleId: 'google-id',
      name: 'qqboxy',
      email: 'qqboxy@example.com',
      picture: '',
      role: 'user',
    });

    expect(repository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        googleId: 'google-id',
        name: 'qqboxy',
        lineUserIds: [],
      }),
    );
  });

  it('should find a user by line user ID', async () => {
    repository.find.mockResolvedValue([
      { id: 1, name: 'qqboxy', lineUserIds: ['line-user-id'] },
      { id: 2, name: 'catboxy', lineUserIds: ['cat-line-user-id'] },
    ]);

    await expect(service.findOneByLineUserId('line-user-id')).resolves.toEqual({
      id: 1,
      name: 'qqboxy',
      lineUserIds: ['line-user-id'],
    });
  });

  it('should update line user IDs', async () => {
    repository.findOneBy.mockResolvedValue({
      id: 1,
      name: 'qqboxy',
      lineUserIds: [' line-user-id ', 'line-user-id'],
    });

    await expect(
      service.update(1, { lineUserIds: [' line-user-id ', 'line-user-id'] }),
    ).resolves.toEqual({
      id: 1,
      name: 'qqboxy',
      lineUserIds: [' line-user-id ', 'line-user-id'],
    });

    expect(repository.update).toHaveBeenCalledWith(
      { id: 1 },
      expect.objectContaining({
        lineUserIds: [' line-user-id ', 'line-user-id'],
      }),
    );
  });

  it('should update a user role', async () => {
    repository.findOneBy.mockResolvedValue({
      id: 1,
      name: 'qqboxy',
      role: Role.Admin,
    });

    await expect(service.update(1, { role: Role.Admin })).resolves.toEqual({
      id: 1,
      name: 'qqboxy',
      role: Role.Admin,
    });

    expect(repository.update).toHaveBeenCalledWith(
      { id: 1 },
      expect.objectContaining({ role: Role.Admin }),
    );
  });
});
