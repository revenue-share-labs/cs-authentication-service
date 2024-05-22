import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InternalAuthService } from '../../common/auth/internal/internal-auth.service';

@Injectable()
export class AuthStorageService {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: InternalAuthService,
  ) {
    this.getServiceJwt();
  }

  private readonly logger = new Logger(AuthStorageService.name);

  public serviceJwt = '';

  public async getServiceJwt(): Promise<void> {
    try {
      this.logger.log(`Get service token`);
      const token = await this.authService.signToken({
        sub: this.configService.get('SERVICE_NAME'),
        type: 'internal',
      });
      this.logger.log(`Set service token`);
      this.serviceJwt = token.token;
    } catch (err) {
      this.logger.error(`Error: ${err.message}`);
    }
  }
}
