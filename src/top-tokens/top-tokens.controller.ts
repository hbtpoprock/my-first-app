import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/auth/jwt-auth.guard';
import { TopTokensService } from './top-tokens.service';

@Controller('top-tokens')
export class TopTokensController {
  constructor(private readonly topTokensService: TopTokensService) {}

  @Public()
  @Get()
  getTopTokens() {
    return this.topTokensService.getTopTokens();
  }
}
