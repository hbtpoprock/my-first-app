import { Request, Body, Controller, Post, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthService } from 'src/auth/auth.service';
import { Public } from 'src/auth/jwt-auth.guard';
import { RegisterDto } from './dto/register.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Post('register')
  async register(
    @Body()
    registerDto: RegisterDto,
  ) {
    const user = await this.userService.createUser(
      registerDto.username,
      registerDto.password,
      registerDto.name,
      registerDto.age,
    );
    return { message: 'User registered successfully', user };
  }

  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
