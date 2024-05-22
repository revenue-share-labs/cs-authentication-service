import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { InternalAuthService } from '../../shared/common/auth/internal/internal-auth.service';
import { TokenPayloadDto } from '../../shared/common/auth/internal/dto/token-payload.dto';
import { TokenDto } from '../../shared/common/auth/internal/dto/token.dto';
import { PrismaService } from '../../shared/services/prisma/prisma.service';

@Injectable()
export class TokenService {
  constructor(
    private readonly authService: InternalAuthService,
    private readonly prismaService: PrismaService,
  ) {}

  private readonly logger = new Logger(TokenService.name);

  async exchange(tokenDto: TokenDto, isExchange?: boolean): Promise<TokenDto> {
    let validated: TokenPayloadDto;
    try {
      this.logger.debug(`Check validity of token: ${tokenDto.token}`);
      validated = await this.authService.exchange(tokenDto.token);
    } catch (err) {
      this.logger.debug(`Token validity error: ${err.message}`);
      throw new ForbiddenException('Invalid token');
    }
    if (isExchange) {
      try {
        this.logger.debug(`Remove old token from db`);
        await this.prismaService.token.delete({
          where: {
            value: tokenDto.token,
          },
        });
      } catch (err) {
        this.logger.debug(`Remove token from db error: ${err.message}`);
        throw new ForbiddenException('Error remove old token');
      }
    }

    return this.authService.signToken({
      sub: validated.sub,
      type: validated.type,
    });
  }

  async createServiceToken(name: string): Promise<TokenDto> {
    this.logger.log(`Create service token for: ${name}`);
    return this.authService.signToken({ sub: name, type: 'internal' });
  }
}
