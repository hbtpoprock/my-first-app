import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TopToken, TopTokenDocument } from './top-token.schema';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TopTokensService {
  constructor(
    private readonly httpService: HttpService,
    @InjectModel(TopToken.name, 'topTokensDB')
    private topTokenModel: Model<TopTokenDocument>,
  ) {}

  async getTopTokens() {
    const apiUrl = 'https://swap-api.thetatoken.org/swap/top-tokens';

    try {
      const response = await firstValueFrom(this.httpService.get(apiUrl));
      const tokens = response.data.body.tokens;

      await this.topTokenModel.deleteMany({});
      const tokensWithCustomId = tokens.map(({ id, ...tokenData }) => ({
        _id: id,
        ...tokenData,
      }));

      await this.topTokenModel.insertMany(tokensWithCustomId);
      return tokens;
    } catch (error) {
      console.error('Error fetching or saving top tokens:', error.message);
      throw new Error('Failed to fetch and store top tokens');
    }
  }
}
