import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
@Controller('admin')
export class AdminController {
  constructor(private admin: AdminService) {}

  @Get('dashboard')
  dashboard() {
    return this.admin.dashboard();
  }

  @Get('orders')
  orders(@Query('status') status?: string) {
    return this.admin.listOrders(status);
  }

  @Get('orders/:orderNo')
  orderDetail(@Param('orderNo') orderNo: string) {
    return this.admin.orderDetail(orderNo);
  }

  @Patch('orders/:orderNo/status')
  updateOrderStatus(@Param('orderNo') orderNo: string, @Body() body: { status: string }) {
    return this.admin.updateOrderStatus(orderNo, body.status);
  }
}
