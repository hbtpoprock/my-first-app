import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Create a new user
  async createUser(
    username: string,
    password: string,
    name: string,
    age: number,
  ): Promise<User> {
    const existingUser = await this.userModel.findOne({ username });
    if (existingUser) {
      throw new HttpException(
        'This username already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash password before saving
    const newUser = new this.userModel({
      username,
      password: hashedPassword,
      name,
      age,
    });
    return newUser.save();
  }

  // Validate user login
  async validateUser(username: string, password: string): Promise<boolean> {
    const user = await this.userModel.findOne({ username });
    if (!user) return false;
    return bcrypt.compare(password, user.password);
  }

  async findOne(username: string): Promise<User | undefined> {
    return await this.userModel.findOne({ username });
  }
}
