import { Module } from '@nestjs/common';
import { BigSellerService } from './bigseller.service';
import { BigSellerController } from './bigseller.controller';

@Module({
  providers: [BigSellerService],
  controllers: [BigSellerController],
  exports: [BigSellerService],
})
export class BigSellerModule {}
