import { PrismaService } from '../../shared/services/prisma/prisma.service';
import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { EthereumService } from '../../shared/services/web3/ethereum.service';
import { Nonce } from '@prisma/client';
import { NonceDto } from './dto/nonce.dto';
import { InternalAuthService } from '../../shared/common/auth/internal/internal-auth.service';
import { TokenDto } from '../../shared/common/auth/internal/dto/token.dto';
import { SignedNonceDto } from './dto/signed-nonce.dto';
import { WalletDetailsDto } from './dto/wallet-details.dto';
import { UserServiceService } from '../../shared/services/user-service/user-service.service';

@Injectable()
export class WalletService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly ethereumService: EthereumService,
    private readonly authService: InternalAuthService,
    private readonly userService: UserServiceService,
  ) {}

  private readonly logger = new Logger(WalletService.name);

  async begin(walletDetailsDto: WalletDetailsDto): Promise<NonceDto> {
    this.logger.debug(
      `Generate nonce for wallet: ${walletDetailsDto.publicKey}`,
    );
    const nonce = await this.prismaService.nonce.create({
      data: {
        publicKey: walletDetailsDto.publicKey,
      },
    });

    return {
      nonce: nonce.id,
    };
  }

  async complete(signedNonceDto: SignedNonceDto): Promise<TokenDto> {
    let nonce: Nonce;
    try {
      this.logger.debug(`Find exist nonce: ${signedNonceDto.nonce}`);
      nonce = await this.prismaService.nonce.findUnique({
        where: {
          id: signedNonceDto.nonce,
        },
      });
      this.logger.debug('Validate signature');
      this.ethereumService.validateSignature(
        signedNonceDto.signature,
        nonce.id,
        nonce.publicKey,
      );
    } catch (err) {
      this.logger.debug(
        `Complete wallet account registration error: ${err.message}`,
      );
      throw new ForbiddenException('Invalid nonce or signature');
    }
    this.logger.debug(`Get or create user with wallet: ${nonce.publicKey}`);
    const user = await this.userService.getOrCreateUser({
      address: nonce.publicKey,
      provider: signedNonceDto.provider,
    });
    this.logger.debug(`Generate token for user with id: ${user.id}`);
    const tokenDto: TokenDto = await this.authService.signToken({
      sub: user.id,
      type: 'external',
    });
    if (user.newUser) {
      tokenDto.newUser = user.newUser;
    }
    return tokenDto;
  }
}
