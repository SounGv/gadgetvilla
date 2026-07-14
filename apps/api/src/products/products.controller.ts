import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private products: ProductsService) {}

  @Get()
  list(
    @Query('brand') brand?: string,
    @Query('featured') featured?: string,
    @Query('sort') sort?: string,
    @Query('limit') limit?: string,
  ) {
    return this.products.list({ brand, featured, sort, limit });
  }

  // รายการสำหรับแอดมิน (ต้องมาก่อน :slug เพื่อไม่ให้ถูกจับเป็น slug)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Get('admin/list')
  adminList(@Query('q') q?: string, @Query('limit') limit?: string, @Query('offset') offset?: string) {
    return this.products.adminList({ q, limit, offset });
  }

  @Get(':slug')
  getBySlug(@Param('slug') slug: string) {
    return this.products.getBySlug(slug);
  }

  // ---- Admin CRUD (RBAC) ----
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Post()
  create(
    @Body()
    body: {
      name: string;
      slug: string;
      brandSlug: string;
      categorySlug?: string;
      shortDesc?: string;
      description?: string;
      price: number;
      compareAtPrice?: number;
      sku?: string;
      barcode?: string;
      imageUrl?: string;
      images?: string[];
      warranty?: string;
      stock?: number;
      isFeatured?: boolean;
      isNewArrival?: boolean;
    },
  ) {
    return this.products.create(body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Post('import')
  importProducts(@Body() body: { markup?: number; rows: Array<Record<string, unknown>> }) {
    return this.products.importProducts(body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Patch(':id/stock')
  setStock(@Param('id') id: string, @Body() body: { stock: number }) {
    return this.products.setStock(id, Number(body.stock) || 0);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    body: {
      name?: string;
      slug?: string;
      brandSlug?: string;
      categorySlug?: string;
      shortDesc?: string;
      description?: string;
      warranty?: string;
      price?: number;
      compareAtPrice?: number | null;
      stock?: number;
      sku?: string;
      barcode?: string;
      images?: string[];
      isFeatured?: boolean;
      isNewArrival?: boolean;
      status?: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
    },
  ) {
    return this.products.adminUpdate(id, body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.products.remove(id);
  }
}
