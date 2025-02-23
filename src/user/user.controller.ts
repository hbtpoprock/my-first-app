import {
  Request,
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthService } from 'src/auth/auth.service';
import { Public } from 'src/auth/jwt-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

  @Patch(':id')
  async updateUser(
    @Param('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(userId, updateUserDto);
  }

  @Delete(':id')
  async softDeleteUser(@Param('id') userId: string): Promise<string> {
    return await this.userService.softDeleteUser(userId);
  }

  @Patch(':id/restore')
  async restoreUser(@Param('id') userId: string): Promise<string> {
    return await this.userService.restoreUser(userId);
  }

  // search users api that returns array of users with pagination
}
