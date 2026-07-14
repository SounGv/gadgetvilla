import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';

@Module({
  providers: [AdminService, SettingsService],
  controllers: [AdminController, SettingsController],
})
export class AdminModule {}
