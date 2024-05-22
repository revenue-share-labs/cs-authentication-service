import { Test } from '@nestjs/testing';
import { mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { XsollaAuthModule } from './xsolla-auth.module';
import { PrismaModule } from '../../../services/prisma/prisma.module';
import { PrismaService } from '../../../services/prisma/prisma.service';

describe('XsollaAuthModule', () => {
  it('should compile the module', async () => {
    const xsollaAuthModule: XsollaAuthModule = await Test.createTestingModule({
      imports: [XsollaAuthModule, PrismaModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    expect(xsollaAuthModule).toBeDefined();
  });
});
