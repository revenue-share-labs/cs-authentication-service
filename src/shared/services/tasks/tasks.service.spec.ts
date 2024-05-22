/* eslint-disable @typescript-eslint/ban-ts-comment */

import { Test } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { mockDeep } from 'jest-mock-extended';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InternalAuthService } from '../../common/auth/internal/internal-auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { TasksService } from './tasks.service';
import { AuthStorageService } from '../storage/auth-storage.service';

describe('TasksService', () => {
  let tasksService: TasksService;
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
      controllers: [TasksService],
      providers: [
        TasksService,
        AuthStorageService,
        InternalAuthService,
        PrismaService,
        ConfigService,
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    tasksService = moduleRef.get(TasksService);
    authStorageService = moduleRef.get(AuthStorageService);
  });

  it('should be defined', () => {
    expect(tasksService).toBeDefined();
  });

  describe('handleCron', () => {
    it('should handle get service token', async () => {
      await tasksService.handleCron();
      expect(authStorageService.serviceJwt.length).toBeGreaterThan(1);
    });
  });
});
