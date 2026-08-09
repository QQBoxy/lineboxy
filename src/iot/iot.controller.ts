import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { IotDto } from './dto/iot.dto';
import { UpdateIotDto } from './dto/update-iot.dto';
import { IotService } from './iot.service';

@UseInterceptors(ClassSerializerInterceptor)
@ApiCookieAuth()
@ApiTags('IoT')
@Controller()
export class IotController {
  constructor(private readonly iotService: IotService) {}

  @Get(':topic')
  @ApiOperation({ summary: 'Get IoT Device State by Topic' })
  @ApiResponse({ status: 200, description: 'Successful', type: IotDto })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @Roles(Role.Admin)
  findOne(@Req() req: Request, @Param('topic') topic: string) {
    return this.iotService.findOne(req, topic);
  }

  @Patch(':topic')
  @ApiOperation({ summary: 'Update IoT Device State by Topic' })
  @ApiResponse({ status: 200, description: 'Successful', type: IotDto })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @Roles(Role.Admin)
  update(
    @Req() req: Request,
    @Param('topic') topic: string,
    @Body() updateIotDto: UpdateIotDto,
  ): IotDto {
    return this.iotService.update(req, topic, updateIotDto);
  }
}
