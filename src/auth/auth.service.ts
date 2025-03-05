import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<UserPayload> {
    const user = await this.userService.findOne(username);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const userObj = JSON.parse(JSON.stringify(user));
      const { password, ...result } = userObj;
      return result;
    }
    return null;
  }

  async login(user: UserPayload) {
    const payload = {
      username: user.username,
      sub: user._id,
      name: user.name,
      age: user.age,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
