import { Test } from '@nestjs/testing';
import { mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { PrismaModule } from '../../shared/services/prisma/prisma.module';
import { PrismaService } from '../../shared/services/prisma/prisma.service';
import { PartnerModule } from './partner.module';

describe('PartnerModule', () => {
  it('should compile the module', async () => {
    const partnerModule: PartnerModule = await Test.createTestingModule({
      imports: [PartnerModule, PrismaModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    expect(partnerModule).toBeDefined();
  });
});
