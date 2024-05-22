/* eslint-disable @typescript-eslint/ban-ts-comment */

import { Test } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { mockDeep } from 'jest-mock-extended';
import { PrismaService } from '../prisma/prisma.service';
import { EthereumService } from './ethereum.service';
import { Wallet } from 'ethers';

describe('EthereumService', () => {
  let ethereumService: EthereumService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [EthereumService],
      providers: [EthereumService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    ethereumService = moduleRef.get(EthereumService);
  });

  it('should be defined', () => {
    expect(ethereumService).toBeDefined();
  });

  describe('validateSignature', () => {
    it('should validate signature and return true', async () => {
      const wallet = Wallet.createRandom();
      const address = await wallet.getAddress();
      const signature = await wallet.signMessage('1');
      expect(() =>
        ethereumService.validateSignature(signature, '1', address),
      ).toBeTruthy();
    });
    it('should validate signature and return false with wrong data', async () => {
      const wallet = Wallet.createRandom();
      const address = await wallet.getAddress();
      const signature = await wallet.signMessage('1');
      expect(() =>
        ethereumService.validateSignature(signature, '2', address),
      ).toThrowError('Source address is not equal to recovered');
    });
  });
});
