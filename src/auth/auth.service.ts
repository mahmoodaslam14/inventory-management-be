import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail({ email }: { email: string }): Promise<any | undefined> {
    const lowercaseEmail = email.toLowerCase();
    const user = await this.userRepository
      .createQueryBuilder('users')
      .where('LOWER(users.email) = :email', { email: lowercaseEmail })
      // .select([
      //   'users.id',
      //   'users.name',
      //   'users.email',
      //   'users.password',
      //   'users.contactNo',
      // ])
      .getOne();
    if (user) {
      await this.userRepository.save(user); // Save the updated user entity
    }

    return user;
  }

  async validateUser(email: string, password: string) {
    const normalizedEmail = email.toLowerCase().trim().replace(/\s/g, '');

    const user = await this.findByEmail({ email: normalizedEmail });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(signupDto: SignupDto): Promise<User> {
    const normalizedEmail = signupDto.email
      .toLowerCase()
      .trim()
      .replace(/\s/g, '');

    const existingUser = await this.findByEmail({ email: normalizedEmail });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(signupDto.password.toString(), 10);

    const user: DeepPartial<User> = {
      ...signupDto,
      password: hashedPassword,
    };

    const createdUser = await this.userRepository.create(user);

    const savedUser = await this.userRepository.save(createdUser);

    return savedUser;

    // return this.usersService.create(signupDto);
  }
}
