import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() body: { username: string; password: string }) {
    const user = await this.userService.createUser(
      body.username,
      body.password,
    );
    return { message: 'User registered successfully', user };
  }

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const isValid = await this.userService.validateUser(
      body.username,
      body.password,
    );
    if (isValid) {
      return { message: 'Login successful' };
    } else {
      return { message: 'Invalid credentials' };
    }
  }
}
