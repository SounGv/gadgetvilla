import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { BigSellerService } from './bigseller.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('integrations/bigseller')
@Controller('integrations/bigseller')
export class BigSellerController {
  constructor(private bigseller: BigSellerService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Post('sync')
  sync() {
    return this.bigseller.syncProducts();
  }

  // webhook realtime จาก BigSeller (ตรวจ signature ตาม BIGSELLER_WEBHOOK_SECRET)
  @Post('webhook')
  webhook(@Body() body: { event: string; sku?: string; quantity?: number }) {
    if (body.event === 'inventory.updated' && body.sku != null && body.quantity != null) {
      return this.bigseller.updateInventory(body.sku, body.quantity);
    }
    return { ok: true };
  }
}
