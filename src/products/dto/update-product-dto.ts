import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateProductDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  barcode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  category: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  price: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  costPrice: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  stock: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  unit: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  userId: number;
}
