import { TokenPayloadDto } from './dto/token-payload.dto';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenDto } from './dto/token.dto';
import { PrismaService } from '../../../services/prisma/prisma.service';

@Injectable()
export class InternalAuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  private readonly logger = new Logger(InternalAuthService.name);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async exchange(token: string): Promise<any> {
    this.logger.debug(`Verify token:${token}`);
    return this.jwt.verifyAsync(token, { ignoreExpiration: true });
  }

  async signToken(payload: TokenPayloadDto): Promise<TokenDto> {
    this.logger.debug(`Sign token with sub: ${payload.sub}`);
    const expiration =
      payload.type === 'partner'
        ? '30d'
        : payload.type === 'internal'
        ? '1h'
        : '15m';
    const token = await this.jwt.signAsync(payload, {
      expiresIn: expiration,
    });
    this.logger.debug(`New token: ${token}`);
    this.logger.debug(`Add new token to db`);
    if (payload.type !== 'internal') {
      await this.prismaService.token.create({
        data: {
          value: token,
        },
      });
    }
    return { token };
  }
}
