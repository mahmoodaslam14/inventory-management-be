// src/users/users.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  NotFoundException,
  ParseIntPipe,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { createErrorResponse, createSuccessResponse } from 'src/utils/helper';
import { PaginationDto, UserLIstDto } from './dto/list-user-dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create user' })
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.create(createUserDto);
      const userData = {
        userId: user.id,
        email: user.email,
        name: user.name,
        contactNo: user.contactNo,
      };
      return createSuccessResponse(
        HttpStatus.CREATED,
        'User created successfully',
        userData,
      );
    } catch (error) {
      return createErrorResponse(error.status, error.message);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  async findAll(
    @Query() userLIstDto: UserLIstDto,
    @Query() pagination: PaginationDto,
  ) {
    try {
      const result = await this.usersService.findAll(userLIstDto, pagination);
      return createSuccessResponse(
        HttpStatus.OK,
        'User list retrieved successfully',
        result,
      );
    } catch (error) {
      return createErrorResponse(
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    // const user = await this.usersService.findOne(id);
    // if (!user) throw new NotFoundException('User not found');
    // return user;
    try {
      const user = await this.usersService.findOne(id);
      if (!user) throw new NotFoundException('User not found');
      const userData = {
        userId: user.id,
        email: user.email,
        name: user.name,
        contactNo: user.contactNo,
      };
      return createSuccessResponse(
        HttpStatus.OK,
        'User retrieved successfully',
        userData,
      );
    } catch (error) {
      return createErrorResponse(error.status, error.message);
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user by ID' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const user = await this.usersService.update(id, updateUserDto);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const userData = {
        userId: user.id,
        email: user.email,
        name: user.name,
        contactNo: user.contactNo,
      };
      return createSuccessResponse(
        HttpStatus.OK,
        'User updated successfully',
        userData,
      );
    } catch (error) {
      return createErrorResponse(error.status, error.message);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by ID' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      const deleted = await this.usersService.remove(id);
      if (!deleted) throw new NotFoundException('User not found');
      return createSuccessResponse(HttpStatus.OK, 'User deleted successfully');
    } catch (error) {
      return createErrorResponse(error.status, error.message);
    }
  }
}
