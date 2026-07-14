import { Module } from '@nestjs/common';
import { TrCloudService } from './trcloud.service';

@Module({
  providers: [TrCloudService],
  exports: [TrCloudService],
})
export class TrCloudModule {}
