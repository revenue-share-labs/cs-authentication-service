import { Web3Module } from './shared/services/web3/web3.module';
import { XsollaAuthModule } from './shared/common/auth/xsolla/xsolla-auth.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InternalAuthModule } from './shared/common/auth/internal/internal-auth.module';
import { PrismaModule } from './shared/services/prisma/prisma.module';
import { HealthModule } from './shared/services/health/health.module';
import { WalletModule } from './api/wallet/wallet.module';
import { XsollaModule } from './api/xsolla/xsolla.module';
import { TokenService } from './api/token/token.service';
import { TokenModule } from './api/token/token.module';

import baseConfig from './shared/common/configs/base.config';
import swaggerConfig from './shared/common/configs/swagger.config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { DefaultFilter } from './shared/common/filters/default.filter';
import corsConfig from './shared/common/configs/cors.config';
import { LogoutModule } from './api/logout/logout.module';
import { GlobalPipe } from './shared/common/pipes/global.pipe';
import { TasksModule } from './shared/services/tasks/tasks.module';
import { ScheduleModule } from '@nestjs/schedule';
import { PartnerModule } from './api/partner/partner.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [baseConfig, swaggerConfig, corsConfig],
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? `/etc/conf/auth-svc/.${process.env.NODE_ENV}.env`
          : `.${process.env.NODE_ENV}.env`,
    }),
    ScheduleModule.forRoot(),
    InternalAuthModule,
    XsollaAuthModule,
    PrismaModule,
    HealthModule,
    WalletModule,
    XsollaModule,
    TokenModule,
    Web3Module,
    LogoutModule,
    TasksModule,
    PartnerModule,
  ],
  providers: [
    TokenService,
    {
      provide: APP_FILTER,
      useClass: DefaultFilter,
    },
    {
      provide: APP_PIPE,
      useClass: GlobalPipe,
    },
  ],
})
export class AppModule {}
