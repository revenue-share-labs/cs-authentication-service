import { Body, Controller, Post } from '@nestjs/common';
import { WalletService } from './wallet.service';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { NonceDto } from './dto/nonce.dto';
import { TokenDto } from '../../shared/common/auth/internal/dto/token.dto';
import { SignedNonceDto } from './dto/signed-nonce.dto';
import { WalletDetailsDto } from './dto/wallet-details.dto';
import { ApiErrorDto } from '../generic/dto';

@ApiTags('wallet')
@Controller('wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Post('begin')
  @ApiOperation({
    summary: 'Create nonce for authorization by wallet.',
    description: 'This method returns a nonce for authorization by the wallet.',
  })
  @ApiCreatedResponse({
    type: NonceDto,
  })
  begin(@Body() walletDetailsDto: WalletDetailsDto): Promise<NonceDto> {
    return this.walletService.begin(walletDetailsDto);
  }

  @Post('complete')
  @ApiOperation({
    summary: 'Authorization by wallet.',
    description: 'This method returns a token of authorization by the wallet.',
  })
  @ApiCreatedResponse({
    type: TokenDto,
  })
  @ApiForbiddenResponse({
    type: ApiErrorDto,
  })
  complete(@Body() signedNonceDto: SignedNonceDto): Promise<TokenDto> {
    return this.walletService.complete(signedNonceDto);
  }
}
