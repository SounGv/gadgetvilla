import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray, IsBoolean, IsEmail, IsEnum, IsOptional, IsString, MinLength, ValidateNested,
} from 'class-validator';

class OrderItemDto {
  @ApiProperty() @IsString() variantId!: string;
  @ApiProperty() @Type(() => Number) quantity!: number;
}

export enum PaymentMethodDto {
  promptpay = 'promptpay',
  credit_card = 'credit_card',
  mobile_banking = 'mobile_banking',
  cod = 'cod',
}

export class CreateOrderDto {
  @ApiProperty() @IsString() name!: string;
  @ApiProperty() @IsString() phone!: string;
  @ApiProperty() @IsEmail() email!: string;
  @ApiProperty() @IsString() @MinLength(5) line1!: string;
  @ApiProperty() @IsString() subdistrict!: string;
  @ApiProperty() @IsString() district!: string;
  @ApiProperty() @IsString() province!: string;
  @ApiProperty() @IsString() postalCode!: string;
  @ApiProperty() @IsString() carrier!: string;
  @ApiProperty({ enum: PaymentMethodDto }) @IsEnum(PaymentMethodDto) paymentMethod!: PaymentMethodDto;
  @ApiProperty({ required: false }) @IsOptional() @IsBoolean() wantTaxInvoice?: boolean;
  @ApiProperty({ type: [OrderItemDto] })
  @IsArray() @ValidateNested({ each: true }) @Type(() => OrderItemDto)
  items!: OrderItemDto[];
}
