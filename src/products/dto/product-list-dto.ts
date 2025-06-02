import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class ProductListDto {
  @ApiPropertyOptional()
  @IsOptional()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  category: string;

  @ApiPropertyOptional()
  @IsOptional()
  barcode: string;

  @ApiPropertyOptional()
  @IsOptional()
  search: string;
}

export class PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  page: number;

  @ApiPropertyOptional()
  @IsOptional()
  limit: number;
}
