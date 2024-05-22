/* eslint-disable @typescript-eslint/ban-ts-comment */

import { Test } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { mockDeep } from 'jest-mock-extended';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InternalAuthService } from './internal-auth.service';
import { PrismaService } from '../../../services/prisma/prisma.service';
import { TokenPayloadDto } from './dto/token-payload.dto';

describe('InternalAuthService', () => {
  let internalAuthService: InternalAuthService;

  const mockPayload: TokenPayloadDto = {
    sub: '1',
    type: 'internal',
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
      controllers: [InternalAuthService],
      providers: [InternalAuthService, PrismaService, ConfigService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    internalAuthService = moduleRef.get(InternalAuthService);
  });

  it('should be defined', () => {
    expect(internalAuthService).toBeDefined();
  });

  describe('signToken', () => {
    it('should return new token', async () => {
      const result = await internalAuthService.signToken(mockPayload);
      expect(result).toHaveProperty('token');
    });
  });

  describe('exchange', () => {
    it('should verify token', async () => {
      const { token } = await internalAuthService.signToken(mockPayload);
      expect(await internalAuthService.exchange(token));
    });
  });
});
