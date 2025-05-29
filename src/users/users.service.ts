// src/users/users.service.ts
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Not, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto, UserLIstDto } from './dto/list-user-dto';
import { userSearchFields } from 'src/utils/searchColumn';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async findByEmail({ email }: { email: string }): Promise<any | undefined> {
    const lowercaseEmail = email.toLowerCase();
    const user = await this.userRepo
      .createQueryBuilder('user')
      .where('LOWER(user.email) = :email', { email: lowercaseEmail })
      // .select([
      //   'users.id',
      //   'users.name',
      //   'users.email',
      //   'users.password',
      //   'users.contactNo',
      // ])
      .getOne();
    if (user) {
      await this.userRepo.save(user); // Save the updated user entity
    }

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const normalizedEmail = createUserDto.email
      .toLowerCase()
      .trim()
      .replace(/\s/g, '');

    const existingUser = await this.findByEmail({ email: normalizedEmail });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user: DeepPartial<User> = {
      ...createUserDto,
      password: hashedPassword,
    };

    const createdUser = await this.userRepo.create(user);

    const savedUser = await this.userRepo.save(createdUser);

    return savedUser;
  }

  async findAll(query: UserLIstDto, pagination: PaginationDto): Promise<any> {
    const { name, email, search, contactNo } = query;
    const { page, limit } = pagination;
    const skip = ((page ?? 1) - 1) * (limit ?? 10);

    const queryBuilder = this.userRepo
      .createQueryBuilder('user')
      // .leftJoinAndSelect('user.userRoles', 'userRoles')
      // .leftJoinAndSelect('userRoles.role', 'roles')
      // .leftJoinAndSelect('userRoles.department', 'department')
      // .leftJoinAndSelect('roles.actions', 'actions')
      // .where('user.isSuperAdmin = :isSuperAdmin', { isSuperAdmin: false })
      .orderBy('user.id', 'DESC');

    if (name) {
      queryBuilder.andWhere('user.name ILIKE :name', {
        name: `%${name}%`,
      });
    }
    if (contactNo) {
      queryBuilder.andWhere('user.contactNo ILIKE :contactNo', {
        contactNo: `%${contactNo}%`,
      });
    }
    if (email) {
      queryBuilder.andWhere('user.email ILIKE :email', { email: `%${email}%` });
    }

    if (search && userSearchFields.length > 0) {
      const whereConditions = userSearchFields
        .map((field) => {
          return `user.${field} ILIKE :search`;
        })
        .join(' OR ');

      queryBuilder.andWhere(`(${whereConditions})`, { search: `%${search}%` });
    }

    const totalRows = await queryBuilder.getCount();

    // Get the data
    const list = await queryBuilder.skip(skip).take(limit).getMany();

    return { totalRows, list };
  }

  findOne(id: number): Promise<User | null> {
    return this.userRepo.findOne({ where: { id } });
  }

  // async findByEmail(email: string): Promise<User | null> {
  //   return this.userRepo.findOne({ where: { email } });
  // }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id: id },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const existingUser = await this.getUserById(id);

    if (updateUserDto.email !== undefined) {
      const normalizedEmail = updateUserDto.email
        .toLowerCase()
        .trim()
        .replace(/\s/g, '');

      const existingUserWithEmail = await this.userRepo.findOne({
        where: { email: normalizedEmail, id: Not(id) },
      });

      if (existingUserWithEmail) {
        throw new ConflictException('Email already exists');
      }

      existingUser.email = normalizedEmail;
    }

    if (updateUserDto.contactNo !== undefined) {
      existingUser.contactNo = updateUserDto.contactNo;
    }
    if (updateUserDto.name !== undefined) {
      existingUser.name = updateUserDto.name;
    }

    if (updateUserDto.password !== undefined) {
      existingUser.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    return this.userRepo.save(existingUser);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.userRepo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
