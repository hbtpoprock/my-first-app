import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { TopTokensService } from './top-tokens.service';
import { TopTokensController } from './top-tokens.controller';
import { TopToken, TopTokenSchema } from './top-token.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TopToken.name, schema: TopTokenSchema },
    ]), // Register the TopToken schema
    HttpModule, // Allows making HTTP requests
  ],
  controllers: [TopTokensController],
  providers: [TopTokensService],
  // exports: [TopTokensService],
})
export class TopTokensModule {}
