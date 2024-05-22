import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { InternalAuthService } from './internal-auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('INTERNAL_JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [InternalAuthService],
  exports: [InternalAuthService],
})
export class InternalAuthModule {}
