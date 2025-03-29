import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { SoftDeleteModel } from 'mongoose-delete';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name, 'usersDB')
    private userModel: SoftDeleteModel<UserDocument>,
  ) {}

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

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<Partial<User>> {
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(
        userId,
        {
          $set: { name: updateUserDto.name, age: updateUserDto.age },
          $inc: { __v: 1 },
        },
        { new: true, runValidators: true },
      );

      if (!updatedUser) {
        throw new NotFoundException('User not found');
      }

      const userObj = JSON.parse(JSON.stringify(updatedUser));
      const { password, ...result } = userObj;
      return result;
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new HttpException(
          `Validation Error: ${error.message}`,
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw error; // Re-throw other errors
      }
    }
  }

  async softDeleteUser(userId: string): Promise<string> {
    const user = await this.userModel.findById({ _id: userId });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    user.delete();
    return `User with ID ${userId} successfully deleted`;
  }

  async restoreUser(userId: string): Promise<string> {
    const user = await this.userModel.findOneDeleted({ _id: userId });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    user.restore();
    return `User with ID ${userId} successfully restored`;
  }

  async searchUsers(
    query: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: User[];
    totalItems: number;
    currentPage: number;
    totalPages: number;
  }> {
    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Build the filter object based on the query
    const filter = query
      ? {
          $or: [
            { username: { $regex: query, $options: 'i' } },
            { name: { $regex: query, $options: 'i' } },
            ...(isNaN(Number(query)) ? [] : [{ age: Number(query) }]),
          ],
        }
      : {};

    // Retrieve the filtered data with pagination
    const data = await this.userModel
      .find(filter)
      .select('-password -deleted') // Exclude the password field
      .skip(skip)
      .limit(limit)
      .exec();

    // Get the total count of documents matching the filter
    const totalItems = await this.userModel.countDocuments(filter).exec();

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalItems / limit);

    return {
      data,
      totalItems,
      currentPage: page,
      totalPages,
    };
  }
}
