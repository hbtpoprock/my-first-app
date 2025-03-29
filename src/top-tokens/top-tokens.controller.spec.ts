import { Test, TestingModule } from '@nestjs/testing';
import { TopTokensController } from './top-tokens.controller';

describe('TopTokensController', () => {
  let controller: TopTokensController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TopTokensController],
    }).compile();

    controller = module.get<TopTokensController>(TopTokensController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
