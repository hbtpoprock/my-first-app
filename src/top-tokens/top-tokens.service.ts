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
    private topTokenModel: Model<TopTokenDocument>, // Ensure the injection is correct
  ) {}

  async getTopTokens() {
    const apiUrl = 'https://swap-api.thetatoken.org/swap/top-tokens';

    try {
      // Fetch token data from the third-party API
      const response = await firstValueFrom(this.httpService.get(apiUrl));
      const tokens = response.data.body.tokens;

      // Clear the collection before saving the new token data
      await this.topTokenModel.deleteMany({});
      // Prepare the tokens data, set _id to the 'id' from the API
      const tokensWithCustomId = tokens.map(({ id, ...tokenData }) => ({
        ...tokenData,
        _id: id, // Use the 'id' from the API as _id
      }));

      // Insert the tokens with custom _id using insertMany
      await this.topTokenModel.insertMany(tokensWithCustomId);
      return tokens; // Return the token list
    } catch (error) {
      console.error('Error fetching or saving top tokens:', error.message);
      throw new Error('Failed to fetch and store top tokens');
    }
  }
}
