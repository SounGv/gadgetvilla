import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('settings')
@Controller('settings')
export class SettingsController {
  constructor(private settings: SettingsService) {}

  // อ่านค่าได้แบบ public (หน้าเว็บดึงไปโชว์)
  @Get(':key')
  get(@Param('key') key: string) {
    return this.settings.get(key);
  }

  // แก้ไขเฉพาะแอดมิน
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Put(':key')
  set(@Param('key') key: string, @Body() body: { value: unknown }) {
    return this.settings.set(key, body.value);
  }
}
