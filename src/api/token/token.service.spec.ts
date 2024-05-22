/* eslint-disable @typescript-eslint/ban-ts-comment */

import { Test } from '@nestjs/testing';
import { PrismaService } from '../../shared/services/prisma/prisma.service';
import { PrismaClient } from '@prisma/client';
import { mockDeep } from 'jest-mock-extended';
import { HttpService } from '@nestjs/axios';
import { UserServiceService } from '../../shared/services/user-service/user-service.service';
import { InternalAuthService } from '../../shared/common/auth/internal/internal-auth.service';
import { AuthStorageService } from '../../shared/services/storage/auth-storage.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ForbiddenException } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenDto } from '../../shared/common/auth/internal/dto/token.dto';

describe('TokenService', () => {
  let tokenService: TokenService;
  const httpService = mockDeep<HttpService>();

  const mockToken: TokenDto = {
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhdXRoLXNlcnZpY2UiLCJ0eXBlIjoiaW50ZXJuYWwiLCJpYXQiOjE2NzkzMTM2MjAsImV4cCI6MTY3OTMxNzIyMH0.LSZ554YUgClNsRi0TSL7o8dyg8_849PY92yRTMIzH_w',
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
      controllers: [TokenService],
      providers: [
        TokenService,
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

    tokenService = moduleRef.get(TokenService);
  });

  it('should be defined', () => {
    expect(tokenService).toBeDefined();
  });

  describe('exchange', () => {
    it('should return new token', async () => {
      const result = await tokenService.exchange(mockToken);
      expect(result).toHaveProperty('token');
    });
    it('should return ForbiddenException with wrong token', async () => {
      try {
        await tokenService.exchange({ token: '123' });
      } catch (err) {
        expect(err).toBeInstanceOf(ForbiddenException);
      }
    });
  });

  describe('createServiceToken', () => {
    it('should return new internal token for service', async () => {
      const result = await tokenService.createServiceToken('test');
      const token = JSON.parse(atob(result.token.split('.')[1]));
      expect(result).toHaveProperty('token');
      expect(token.sub).toEqual('test');
    });
  });
});
