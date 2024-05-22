import { Module } from '@nestjs/common';
import { AuthStorageService } from './auth-storage.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { InternalAuthModule } from '../../common/auth/internal/internal-auth.module';

@Module({
  imports: [
    ConfigModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        baseURL: configService.get('AUTH_SERVICE_URL'),
        timeout: +configService.get('AXIOS_TIMEOUT'),
      }),
      inject: [ConfigService],
    }),
    InternalAuthModule,
  ],
  providers: [AuthStorageService],
  exports: [AuthStorageService],
})
export class StorageModule {}
