import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private orders: OrdersService) {}

  @Post()
  create(@Body() dto: CreateOrderDto, @Req() req: { user?: { id: string } }) {
    return this.orders.create(dto, req.user?.id);
  }

  @Get(':orderNo/status')
  status(@Param('orderNo') orderNo: string) {
    return this.orders.publicStatus(orderNo);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':orderNo')
  findOne(@Param('orderNo') orderNo: string) {
    return this.orders.findByOrderNo(orderNo);
  }
}
