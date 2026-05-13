import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TopTokensModule } from './top-tokens/top-tokens.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      connectionName: 'usersDB',
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('USERS_MONGODB_URI'),
      }),
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      connectionName: 'topTokensDB',
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('TOP_TOKENS_MONGODB_URI'),
      }),
    }),
    UserModule,
    AuthModule,
    TopTokensModule,
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
