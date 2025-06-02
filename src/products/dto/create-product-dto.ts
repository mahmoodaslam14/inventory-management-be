import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  barcode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  costPrice: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  stock: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  unit: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
