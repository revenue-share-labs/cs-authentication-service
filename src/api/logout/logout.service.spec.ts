/* eslint-disable @typescript-eslint/ban-ts-comment */

import { Test } from '@nestjs/testing';
import { PrismaService } from '../../shared/services/prisma/prisma.service';
import { PrismaClient, Token } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { ForbiddenException } from '@nestjs/common';
import { LogoutService } from './logout.service';

describe('LogoutService', () => {
  let logoutService: LogoutService;
  let prismaService: DeepMockProxy<PrismaClient>;

  const date = new Date();

  const mockToken: Token = {
    value: '12345',
    id: '1',
    createdAt: date,
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [LogoutService],
      providers: [LogoutService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    logoutService = moduleRef.get(LogoutService);
    prismaService = moduleRef.get(PrismaService);
  });

  it('should be defined', () => {
    expect(logoutService).toBeDefined();
  });
  describe('logout', () => {
    it('should delete token', async () => {
      //@ts-ignore
      prismaService.token.delete.mockResolvedValue(mockToken);
      await logoutService.logout({ token: '12345' });
    });
    it('should return ForbiddenException with wrong token', async () => {
      try {
        await logoutService.logout({ token: '123456' });
      } catch (err) {
        expect(err).toBeInstanceOf(ForbiddenException);
      }
    });
  });
});
