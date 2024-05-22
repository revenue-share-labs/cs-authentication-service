import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { XsollaAuthService } from './xsolla-auth.service';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('XSOLLA_JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [XsollaAuthService],
  exports: [XsollaAuthService],
})
export class XsollaAuthModule {}
