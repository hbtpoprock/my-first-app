import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './user.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    MongooseModule.forFeature(
      [{ name: User.name, schema: UserSchema }],
      'usersDB',
    ),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
