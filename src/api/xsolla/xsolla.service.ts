import { XsollaAuthService } from '../../shared/common/auth/xsolla/xsolla-auth.service';
import { InternalAuthService } from '../../shared/common/auth/internal/internal-auth.service';
import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { TokenDto } from '../../shared/common/auth/internal/dto/token.dto';
import { UserServiceService } from '../../shared/services/user-service/user-service.service';

@Injectable()
export class XsollaService {
  constructor(
    private readonly userService: UserServiceService,
    private readonly internalAuthService: InternalAuthService,
    private readonly xsollaAuthService: XsollaAuthService,
  ) {}

  private readonly logger = new Logger(XsollaService.name);

  async exchange(tokenDto: TokenDto): Promise<TokenDto> {
    try {
      this.logger.debug(`Verify xsolla token: ${tokenDto.token}`);
      await this.xsollaAuthService.verify(tokenDto.token);
    } catch (err) {
      this.logger.debug(`Verify xsolla token error: ${err.message}`);
      throw new ForbiddenException('Invalid token');
    }
    this.logger.debug(`Get email from xsolla token: ${tokenDto.token}`);
    const emailFromToken = await this.xsollaAuthService.getEmailXsollaToken(
      tokenDto.token,
    );
    this.logger.debug(`Get user by email: ${emailFromToken}`);
    const user = await this.userService.getOrCreateUser({
      email: emailFromToken,
    });
    this.logger.debug(`Generate token with sub: ${user.id}`);
    const token: TokenDto = await this.internalAuthService.signToken({
      sub: user.id,
      type: 'external',
    });
    if (user.newUser) {
      token.newUser = user.newUser;
    }
    return token;
  }
}
