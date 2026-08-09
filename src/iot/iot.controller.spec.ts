import { Test, TestingModule } from '@nestjs/testing';

import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { MqttModule } from '../mqtt/mqtt.module';
import { IotController } from './iot.controller';
import { IotService } from './iot.service';

describe('IotController', () => {
  let controller: IotController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MqttModule],
      controllers: [IotController],
      providers: [IotService],
    }).compile();

    controller = module.get<IotController>(IotController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it.each(['findOne', 'update'] as const)(
    'should restrict %s to administrators',
    (methodName) => {
      const roles = Reflect.getMetadata(ROLES_KEY, IotController.prototype[methodName]);

      expect(roles).toEqual([Role.Admin]);
    },
  );
});
