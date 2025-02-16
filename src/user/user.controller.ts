import { Request, Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';

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

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(
    @Request() req,
    @Body() body: { username: string; password: string },
  ) {
    const isValid = await this.userService.validateUser(
      body.username,
      body.password,
    );
    if (isValid) {
      return { message: 'Login successful', reqUser: req.user };
    } else {
      return { message: 'Invalid credentials' };
    }
  }
}
