import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product-dto';
import { UpdateProductDto } from './dto/update-product-dto';
import { createErrorResponse, createSuccessResponse } from 'src/utils/helper';
import { PaginationDto, ProductListDto } from './dto/product-list-dto';

// src/products/products.controller.ts
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() dto: CreateProductDto) {
    // return this.productsService.createProduct(dto);
    try {
      const product = await this.productsService.createProduct(dto);
      const productData = {
        productId: product.id,
        name: product.name,
        barcode: product.barcode,
        category: product.category,
        price: product.price,
        costPrice: product.costPrice,
        stock: product.stock,
        unit: product.unit,
        createdBy: product.user.name,
      };
      return createSuccessResponse(
        HttpStatus.CREATED,
        'Product created successfully',
        productData,
      );
    } catch (error) {
      return createErrorResponse(error.status, error.message);
    }
  }

  // @Get()
  // findAll() {
  //   return this.productsService.findAll();
  // }

  @Get()
  async findAll(
    @Query() productListDto: ProductListDto,
    @Query() pagination: PaginationDto,
  ) {
    try {
      const result = await this.productsService.findAll(
        productListDto,
        pagination,
      );
      const productData = result.list.map((product) => ({
        productId: product.id,
        name: product.name,
        barcode: product.barcode,
        category: product.category,
        price: product.price,
        costPrice: product.costPrice,
        stock: product.stock,
        unit: product.unit,
        createdBy: product.user?.name,
      }));
      return createSuccessResponse(
        HttpStatus.OK,
        'Project list get successfully',
        {
          totalRows: result.totalRows,
          list: productData,
        },
      );
    } catch (error) {
      return createErrorResponse(
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    // return this.productsService.findOne(+id);
    try {
      const product = await this.productsService.findOne(+id);
      if (!product) throw new NotFoundException('Product not found');
      const productData = {
        productId: product.id,
        name: product.name,
        barcode: product.barcode,
        category: product.category,
        price: product.price,
        costPrice: product.costPrice,
        stock: product.stock,
        unit: product.unit,
        createdBy: product.user.name,
      };
      return createSuccessResponse(
        HttpStatus.OK,
        'User retrieved successfully',
        productData,
      );
    } catch (error) {
      return createErrorResponse(error.status, error.message);
    }
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateProductDto,
  ) {
    // return this.productsService.update(+id, updateUserDto);
    try {
      const product = await this.productsService.update(+id, updateUserDto);
      if (!product) {
        throw new NotFoundException('User not found');
      }
      const productData = {
        productId: product.id,
        name: product.name,
        barcode: product.barcode,
        category: product.category,
        price: product.price,
        costPrice: product.costPrice,
        stock: product.stock,
        unit: product.unit,
        createdBy: product.user.name,
      };
      return createSuccessResponse(
        HttpStatus.OK,
        'Product updated successfully',
        productData,
      );
    } catch (error) {
      return createErrorResponse(error.status, error.message);
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    // return this.productsService.remove(+id);
    try {
      const deleted = await this.productsService.remove(+id);
      if (deleted === null || deleted === undefined || deleted === false)
        throw new NotFoundException('Product not found');
      return createSuccessResponse(
        HttpStatus.OK,
        'Product deleted successfully',
      );
    } catch (error) {
      return createErrorResponse(error.status, error.message);
    }
  }
}
