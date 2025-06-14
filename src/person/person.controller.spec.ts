import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { PersonController } from './person.controller';

describe('PersonController', () => {
  let controller: PersonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonController],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {}, // Mock repository
        },
      ],
    }).compile();

    controller = module.get<PersonController>(PersonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
