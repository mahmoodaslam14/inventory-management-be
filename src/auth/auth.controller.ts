import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { createErrorResponse, createSuccessResponse } from 'src/utils/helper';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    // return this.authService.signup(dto);
    try {
      const user = await this.authService.signup(signupDto);
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

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      const user = await this.authService.validateUser(
        loginDto.email,
        loginDto.password,
      );
      const token = await this.authService.login(user);
      const userData = {
        userId: user.id,
        email: user.email,
        name: user.name,
        contactNo: user.contactNo,
        token: token.access_token,
      };

      return createSuccessResponse(
        HttpStatus.OK,
        'User Login Successfully',
        userData,
      );
    } catch (error) {
      return createErrorResponse(error.status, error.message);
    }
  }
}
