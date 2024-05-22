/* eslint-disable @typescript-eslint/ban-ts-comment */

import { Test } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { mockDeep } from 'jest-mock-extended';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../services/prisma/prisma.service';
import { XsollaAuthService } from './xsolla-auth.service';

describe('XsollaAuthService', () => {
  let xsollaAuthService: XsollaAuthService;

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
      controllers: [XsollaAuthService],
      providers: [XsollaAuthService, PrismaService, ConfigService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    xsollaAuthService = moduleRef.get(XsollaAuthService);
  });

  it('should be defined', () => {
    expect(xsollaAuthService).toBeDefined();
  });
});
