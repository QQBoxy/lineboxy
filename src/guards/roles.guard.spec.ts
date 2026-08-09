import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Role } from '../enums/role.enum';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  const createContext = (role: string, email: string) =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({
          user: { role, email },
        }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    }) as unknown as ExecutionContext;

  const createGuard = () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue([Role.Admin]),
    } as unknown as Reflector;
    return new RolesGuard(reflector);
  };

  it('should allow a user whose stored role is admin', async () => {
    const guard = createGuard();

    await expect(
      guard.canActivate(createContext(Role.Admin, 'admin@example.com')),
    ).resolves.toBe(true);
  });

  it('should reject a user whose effective session role is not admin', async () => {
    const guard = createGuard();

    await expect(
      guard.canActivate(createContext(Role.User, 'user@example.com')),
    ).resolves.toBe(false);
  });
});
