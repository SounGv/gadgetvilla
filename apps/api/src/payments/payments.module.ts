import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { OmiseAdapter } from './adapters/omise.adapter';
import { TrCloudModule } from '../integrations/trcloud/trcloud.module';

@Module({
  imports: [TrCloudModule],
  providers: [PaymentsService, OmiseAdapter],
  controllers: [PaymentsController],
  exports: [PaymentsService],
})
export class PaymentsModule {}
