import { ConfigService } from '@nestjs/config';

import { Role } from '../enums/role.enum';
import { UsersService } from '../users/users.service';
import { SessionSerializer } from './session.serializer';

describe('SessionSerializer', () => {
  it('should set the configured admin role on the deserialized user', async () => {
    const user = {
      id: 1,
      email: 'admin@example.com',
      role: Role.User,
    } as any;
    const usersService = {
      findOne: jest.fn().mockResolvedValue(user),
    } as unknown as UsersService;
    const configService = {
      get: jest.fn().mockReturnValue(' Admin@Example.com '),
    } as unknown as ConfigService;
    const serializer = new SessionSerializer(usersService, configService);
    const payload = { id: 1, role: Role.User };
    const done = jest.fn();

    await serializer.deserializeUser(payload, done);

    expect(user.role).toBe(Role.Admin);
    expect(payload.role).toBe(Role.User);
    expect(done).toHaveBeenCalledWith(null, user);
  });
});
