/* eslint-disable @typescript-eslint/ban-ts-comment */

import { Test } from '@nestjs/testing';
import { PrismaService } from '../../shared/services/prisma/prisma.service';
import { PrismaClient } from '@prisma/client';
import { mockDeep } from 'jest-mock-extended';
import { PartnerController } from './partner.controller';
import { PartnerService } from './partner.service';
import { HttpService } from '@nestjs/axios';
import { UserServiceService } from '../../shared/services/user-service/user-service.service';
import { InternalAuthService } from '../../shared/common/auth/internal/internal-auth.service';
import { AuthStorageService } from '../../shared/services/storage/auth-storage.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  UserCreationStrategy,
  UserDto,
  UserRole,
} from '../../shared/services/user-service/dto/user.dto';
import { NotFoundException } from '@nestjs/common';
import { WalletProvider } from '../../shared/services/user-service/dto/user-wallet.dto';

describe('PartnerController', () => {
  let partnerController: PartnerController;
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
      controllers: [PartnerController],
      providers: [
        PartnerService,
        PrismaService,
        UserServiceService,
        InternalAuthService,
        AuthStorageService,
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

    partnerController = moduleRef.get(PartnerController);
  });

  it('should be defined', () => {
    expect(partnerController).toBeDefined();
  });
  describe('complete', () => {
    it('should return token by api key', async () => {
      jest
        .spyOn(httpService.axiosRef, 'get')
        .mockImplementationOnce(() => Promise.resolve({ data: mockUser }));

      const result = await partnerController.complete({ apiKey: '12345' });
      expect(result).toHaveProperty('token');
    });
    it('should return NotFoundException with wrong api key', async () => {
      jest
        .spyOn(httpService.axiosRef, 'get')
        .mockImplementationOnce(() => Promise.resolve({ data: mockUser }));
      try {
        await partnerController.complete({ apiKey: '123456' });
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
