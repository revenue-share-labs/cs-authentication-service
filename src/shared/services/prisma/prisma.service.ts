/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { INestApplication, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient, UnwrapTuple } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  enableShutdownHooks(app: INestApplication) {
    throw new Error('Method not implemented.');
  }
  constructor(configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get('DATABASE_URL'),
        },
      },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cleanDb(): Promise<UnwrapTuple<any>> {
    return this.$transaction([this.token.deleteMany()]);
  }
}
