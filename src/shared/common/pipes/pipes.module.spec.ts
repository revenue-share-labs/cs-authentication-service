import { Test } from '@nestjs/testing';
import { mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { PrismaService } from '../../services/prisma/prisma.service';
import { PipesModule } from './pipes.module';

describe('PipesModule', () => {
  it('should compile the module', async () => {
    const pipesModule: PipesModule = await Test.createTestingModule({
      imports: [PipesModule, PrismaModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    expect(pipesModule).toBeDefined();
  });
});
