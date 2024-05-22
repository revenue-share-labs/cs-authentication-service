/* eslint-disable @typescript-eslint/ban-ts-comment */

import { Test } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { mockDeep } from 'jest-mock-extended';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthStorageService } from './auth-storage.service';
import { InternalAuthService } from '../../common/auth/internal/internal-auth.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AuthStorageService', () => {
  let authStorageService: AuthStorageService;

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
      controllers: [AuthStorageService],
      providers: [
        AuthStorageService,
        InternalAuthService,
        PrismaService,
        ConfigService,
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    authStorageService = moduleRef.get(AuthStorageService);
  });

  it('should be defined', () => {
    expect(authStorageService).toBeDefined();
  });

  describe('getServiceJwt', () => {
    it('should set service token', async () => {
      await authStorageService.getServiceJwt();
      expect(authStorageService.serviceJwt.length).toBeGreaterThan(1);
    });
  });
});
