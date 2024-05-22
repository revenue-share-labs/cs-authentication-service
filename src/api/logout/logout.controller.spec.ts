/* eslint-disable @typescript-eslint/ban-ts-comment */

import { Test } from '@nestjs/testing';
import { PrismaService } from '../../shared/services/prisma/prisma.service';
import { PrismaClient, Token } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { ForbiddenException } from '@nestjs/common';
import { LogoutController } from './logout.controller';
import { LogoutService } from './logout.service';

describe('LogoutController', () => {
  let logoutController: LogoutController;
  let prismaService: DeepMockProxy<PrismaClient>;

  const date = new Date();

  const mockToken: Token = {
    value: '12345',
    id: '1',
    createdAt: date,
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [LogoutController],
      providers: [LogoutService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    logoutController = moduleRef.get(LogoutController);
    prismaService = moduleRef.get(PrismaService);
  });

  it('should be defined', () => {
    expect(logoutController).toBeDefined();
  });
  describe('logout', () => {
    it('should delete token', async () => {
      //@ts-ignore
      prismaService.token.delete.mockResolvedValue(mockToken);
      await logoutController.logout({ token: '12345' });
    });
    it('should return NotFoundException with wrong token', async () => {
      try {
        await logoutController.logout({ token: '123456' });
      } catch (err) {
        expect(err).toBeInstanceOf(ForbiddenException);
      }
    });
  });
});
