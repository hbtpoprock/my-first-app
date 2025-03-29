import { Test, TestingModule } from '@nestjs/testing';
import { TopTokensService } from './top-tokens.service';

describe('TopTokensService', () => {
  let service: TopTokensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TopTokensService],
    }).compile();

    service = module.get<TopTokensService>(TopTokensService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
