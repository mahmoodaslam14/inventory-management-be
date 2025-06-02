// src/products/product.entity.ts
import { User } from '../../users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  barcode: string;

  @Column()
  category: string;

  @Column('decimal')
  price: number;

  @Column('decimal')
  costPrice: number;

  @Column()
  stock: number;

  @Column()
  unit: string;

  @ManyToOne(() => User, (user) => user.products, { eager: true })
  user: User;
}
