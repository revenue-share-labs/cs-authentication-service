import { Test } from '@nestjs/testing';
import { mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { WalletModule } from './wallet.module';
import { PrismaModule } from '../../shared/services/prisma/prisma.module';
import { PrismaService } from '../../shared/services/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Web3Module } from '../../shared/services/web3/web3.module';

describe('WalletModule', () => {
  it('should compile the module', async () => {
    const walletModule: WalletModule = await Test.createTestingModule({
      imports: [
        WalletModule,
        PrismaModule,
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async () => ({
            secret: 'TESTSECRET',
            signOptions: { expiresIn: '1d' },
          }),
          inject: [ConfigService],
        }),
        Web3Module,
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    expect(walletModule).toBeDefined();
  });
});
