import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product-dto';
import { UpdateProductDto } from './dto/update-product-dto';
import { PaginationDto, ProductListDto } from './dto/product-list-dto';
import { productSearchFields } from 'src/utils/searchColumn';

// src/products/products.service.ts
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async createProduct(createProductDto: CreateProductDto) {
    const user = await this.userRepo.findOneBy({ id: createProductDto.userId });
    if (!user) throw new NotFoundException('User not found');

    const product = this.productRepo.create({ ...createProductDto, user });
    return this.productRepo.save(product);
  }

  // async findAll(): Promise<Product[]> {
  //   return this.productRepo.find();
  // }

  async findAll(
    query: ProductListDto,
    pagination: PaginationDto,
  ): Promise<{ totalRows: number; list: Product[] }> {
    const { name, barcode, category, search } = query;
    const { page, limit } = pagination;
    const skip = ((page ?? 1) - 1) * (limit ?? 10);

    const queryBuilder = this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.user', 'user')
      .orderBy('product.id', 'DESC');

    if (name) {
      queryBuilder.andWhere('product.name ILIKE :name', {
        name: `%${name}%`,
      });
    }
    if (barcode) {
      queryBuilder.andWhere('product.barcode ILIKE :barcode', {
        barcode: `%${barcode}%`,
      });
    }
    if (category) {
      queryBuilder.andWhere('product.category ILIKE :category', {
        category: `%${category}%`,
      });
    }

    if (search && productSearchFields.length > 0) {
      const whereConditions = productSearchFields
        .map((field) => {
          return `product.${field} ILIKE :search`;
        })
        .join(' OR ');

      queryBuilder.andWhere(`(${whereConditions})`, { search: `%${search}%` });
    }

    const totalRows = await queryBuilder.getCount();

    // Get the data
    const list = await queryBuilder.skip(skip).take(limit).getMany();

    return { totalRows, list };
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, dto);
    return this.productRepo.save(product);
  }

  async remove(id: number): Promise<void> {
    const result = await this.productRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Product not found');
  }
}
