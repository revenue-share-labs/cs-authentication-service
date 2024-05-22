import { Test } from '@nestjs/testing';
import { mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { PrismaModule } from '../../shared/services/prisma/prisma.module';
import { PrismaService } from '../../shared/services/prisma/prisma.service';
import { LogoutModule } from './logout.module';

describe('LogoutModule', () => {
  it('should compile the module', async () => {
    const logoutModule: LogoutModule = await Test.createTestingModule({
      imports: [LogoutModule, PrismaModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    expect(logoutModule).toBeDefined();
  });
});
