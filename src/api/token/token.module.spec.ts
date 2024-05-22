import { Test } from '@nestjs/testing';
import { mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { PrismaModule } from '../../shared/services/prisma/prisma.module';
import { PrismaService } from '../../shared/services/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TokenModule } from './token.module';
import { InternalAuthModule } from '../../shared/common/auth/internal/internal-auth.module';

describe('TokenModule', () => {
  it('should compile the module', async () => {
    const tokenModule: TokenModule = await Test.createTestingModule({
      imports: [
        TokenModule,
        PrismaModule,
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async () => ({
            secret: 'TESTSECRET',
            signOptions: { expiresIn: '1d' },
          }),
          inject: [ConfigService],
        }),
        InternalAuthModule,
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    expect(tokenModule).toBeDefined();
  });
});
