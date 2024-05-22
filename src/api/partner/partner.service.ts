import { InternalAuthService } from '../../shared/common/auth/internal/internal-auth.service';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { TokenDto } from '../../shared/common/auth/internal/dto/token.dto';
import { UserServiceService } from '../../shared/services/user-service/user-service.service';
import { ApiKeyDto } from './dto/api-key.dto';
import { ApiErrorDto } from '../generic/dto';
import { UserDto } from '../../shared/services/user-service/dto/user.dto';

@Injectable()
export class PartnerService {
  constructor(
    private readonly userService: UserServiceService,
    private readonly internalAuthService: InternalAuthService,
  ) {}

  private readonly logger = new Logger(PartnerService.name);

  async complete(apiKeyDto: ApiKeyDto): Promise<TokenDto> {
    this.logger.debug(`Get user by apiKey: ${apiKeyDto.apiKey}`);

    let user: UserDto;
    try {
      user = await this.userService.getUserByApiKey({
        apiKey: apiKeyDto.apiKey,
      });
    } catch (err) {
      this.logger.debug(`Failed to get user by apiKey err: ${err.message}`);
      if (err.response.status === 404) {
        const apiErrorDto: ApiErrorDto = {
          message: `User with apiKey: ${apiKeyDto.apiKey} not found`,
        };
        throw new NotFoundException(apiErrorDto);
      }
    }

    this.logger.debug(`Generate token with sub: ${user.id}`);
    return this.internalAuthService.signToken({
      sub: user.id,
      type: 'partner',
    });
  }
}
