/* eslint-disable @typescript-eslint/ban-ts-comment */

import { Test } from '@nestjs/testing';
import { PrismaService } from '../../shared/services/prisma/prisma.service';
import { Nonce, PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { HttpService } from '@nestjs/axios';
import { UserServiceService } from '../../shared/services/user-service/user-service.service';
import { InternalAuthService } from '../../shared/common/auth/internal/internal-auth.service';
import { AuthStorageService } from '../../shared/services/storage/auth-storage.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WalletController } from './wallet.controller';
import { WalletProviders } from './dto/signed-nonce.dto';
import { WalletService } from './wallet.service';
import { EthereumService } from '../../shared/services/web3/ethereum.service';
import { Wallet } from 'ethers';
import {
  UserCreationStrategy,
  UserDto,
  UserRole,
} from '../../shared/services/user-service/dto/user.dto';
import { WalletProvider } from '../../shared/services/user-service/dto/user-wallet.dto';

describe('WalletController', () => {
  let walletController: WalletController;
  let prismaService: DeepMockProxy<PrismaClient>;
  const httpService = mockDeep<HttpService>();

  const date = new Date();
  const mockNonce: Nonce = { id: '1', publicKey: '0x00', createdAt: date };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async () => ({
            secret: 'TESTSECRET',
            signOptions: { expiresIn: '1d' },
          }),
          inject: [ConfigService],
        }),
      ],
      controllers: [WalletController],
      providers: [
        WalletService,
        PrismaService,
        UserServiceService,
        InternalAuthService,
        AuthStorageService,
        ConfigService,
        EthereumService,
        {
          provide: HttpService,
          useValue: httpService,
        },
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    walletController = moduleRef.get(WalletController);
    prismaService = moduleRef.get(PrismaService);
  });

  it('should be defined', () => {
    expect(walletController).toBeDefined();
  });

  describe('begin', () => {
    it('should return nonce for begin', async () => {
      //@ts-ignore
      prismaService.nonce.create.mockResolvedValue(mockNonce);
      const result = await walletController.begin({ publicKey: '0x00' });
      expect(result).toHaveProperty('nonce');
      expect(result.nonce).toEqual('1');
    });
  });

  describe('complete', () => {
    it('should return new token for wallet', async () => {
      const wallet = Wallet.createRandom();
      const address = await wallet.getAddress();
      const customNonce: Nonce = {
        id: '1',
        publicKey: address,
        createdAt: new Date(),
      };
      const signature = await wallet.signMessage('1');
      prismaService.nonce.findUnique.mockResolvedValue(customNonce);
      const mockUser: UserDto = {
        id: 'test123',
        email: 'test@gmail.com',
        activeWallet: { address: '0x0', provider: WalletProvider.META_MASK },
        wallets: [{ address: '0x0', provider: WalletProvider.META_MASK }],
        username: 'username',
        firstName: 'Name',
        lastName: 'Test',
        apiKey: '12345',
        createdBy: UserCreationStrategy.ADDRESS,
        roles: [UserRole.ADMIN],
      };
      jest
        .spyOn(httpService.axiosRef, 'post')
        .mockImplementationOnce(() => Promise.resolve({ data: mockUser }));
      const result = await walletController.complete({
        nonce: '1',
        signature: signature,
        provider: WalletProviders.META_MASK,
      });
      expect(result).toHaveProperty('token');
    });
  });
});
