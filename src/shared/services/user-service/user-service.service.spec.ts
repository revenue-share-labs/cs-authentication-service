/* eslint-disable @typescript-eslint/ban-ts-comment */

import { Test } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { mockDeep } from 'jest-mock-extended';
import { HttpService } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotFoundException } from '@nestjs/common';
import { UserServiceService } from './user-service.service';
import { UserCreationStrategy, UserDto, UserRole } from './dto/user.dto';
import { WalletProvider } from './dto/user-wallet.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AuthStorageService } from '../storage/auth-storage.service';
import { InternalAuthService } from '../../common/auth/internal/internal-auth.service';
import { WalletProviders } from '../../../api/wallet/dto/signed-nonce.dto';

describe('UserServiceService', () => {
  let userServiceService: UserServiceService;
  const httpService = mockDeep<HttpService>();

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
      controllers: [UserServiceService],
      providers: [
        UserServiceService,
        AuthStorageService,
        InternalAuthService,
        PrismaService,
        ConfigService,
        {
          provide: HttpService,
          useValue: httpService,
        },
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    userServiceService = moduleRef.get(UserServiceService);
  });

  it('should be defined', () => {
    expect(userServiceService).toBeDefined();
  });
  describe('getUserByApiKey', () => {
    it('should return user by api key', async () => {
      jest
        .spyOn(httpService.axiosRef, 'get')
        .mockImplementationOnce(() => Promise.resolve({ data: mockUser }));

      const result = await userServiceService.getUserByApiKey({
        apiKey: '12345',
      });
      expect(result).toEqual(mockUser);
    });
    it('should return NotFoundException with wrong api key', async () => {
      jest
        .spyOn(httpService.axiosRef, 'get')
        .mockImplementationOnce(() => Promise.reject(new NotFoundException()));
      try {
        await userServiceService.getUserByApiKey({ apiKey: '123456' });
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }
    });
  });
  describe('getOrCreateUser', () => {
    it('should return user by email', async () => {
      jest
        .spyOn(httpService.axiosRef, 'post')
        .mockImplementationOnce(() => Promise.resolve({ data: mockUser }));

      const result = await userServiceService.getOrCreateUser({
        email: 'test@gmail.com',
      });
      expect(result).toEqual(mockUser);
    });
    it('should return user by address and provider', async () => {
      jest
        .spyOn(httpService.axiosRef, 'post')
        .mockImplementationOnce(() => Promise.resolve({ data: mockUser }));

      const result = await userServiceService.getOrCreateUser({
        address: '0x0',
        provider: WalletProviders.META_MASK,
      });
      expect(result).toEqual(mockUser);
    });
    it('should return NotFoundException with wrong api key', async () => {
      jest
        .spyOn(httpService.axiosRef, 'post')
        .mockImplementationOnce(() => Promise.reject(new NotFoundException()));
      try {
        await userServiceService.getOrCreateUser({
          email: 'test@mail.ru',
        });
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
