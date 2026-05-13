import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TopTokensModule } from './top-tokens/top-tokens.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // MongooseModule.forRoot('mongodb://localhost:27017/my-first-app'),
    MongooseModule.forRoot('mongodb://localhost:27017/my-first-app', {
      connectionName: 'usersDB',
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/top-tokens', {
      connectionName: 'topTokensDB',
    }),
    UserModule,
    AuthModule,
    TopTokensModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
