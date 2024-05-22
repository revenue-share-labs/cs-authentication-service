import { Test } from '@nestjs/testing';
import { mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { PrismaModule } from '../../../services/prisma/prisma.module';
import { PrismaService } from '../../../services/prisma/prisma.service';
import { InternalAuthModule } from './internal-auth.module';

describe('InternalAuthModule', () => {
  it('should compile the module', async () => {
    const internalAuthModule: InternalAuthModule =
      await Test.createTestingModule({
        imports: [InternalAuthModule, PrismaModule],
      })
        .overrideProvider(PrismaService)
        .useValue(mockDeep<PrismaClient>())
        .compile();

    expect(internalAuthModule).toBeDefined();
  });
});
