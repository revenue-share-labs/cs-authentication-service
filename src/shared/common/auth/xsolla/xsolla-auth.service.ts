import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class XsollaAuthService {
  constructor(private readonly jwt: JwtService) {}

  private readonly logger = new Logger(XsollaAuthService.name);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async verify(token: string): Promise<any> {
    this.logger.debug(`Verify token: ${token}`);
    return this.jwt.verifyAsync(token);
  }

  async getEmailXsollaToken(token: string): Promise<string> {
    this.logger.debug(`Get email from token: ${token}`);
    const payload = this.jwt.decode(token);
    return payload['email'];
  }
}
