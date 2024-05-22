import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { TokenDto } from '../../shared/common/auth/internal/dto/token.dto';
import { PrismaService } from '../../shared/services/prisma/prisma.service';

@Injectable()
export class LogoutService {
  constructor(private readonly prismaService: PrismaService) {}

  private readonly logger = new Logger(LogoutService.name);

  async logout(tokenDto: TokenDto): Promise<void> {
    try {
      this.logger.debug(`Logout user with token: ${tokenDto.token}`);
      await this.prismaService.token.delete({
        where: {
          value: tokenDto.token,
        },
      });
    } catch (err) {
      this.logger.debug(`Logout error: ${err.message}`);
      throw new ForbiddenException('Invalid token');
    }
  }
}
