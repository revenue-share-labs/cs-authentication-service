import { ApiProperty } from '@nestjs/swagger';
import { NonceDto } from './nonce.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export enum WalletProviders {
  META_MASK = 'META_MASK',
  COINBASE_WALLET = 'COINBASE_WALLET',
  WALLET_CONNECT = 'WALLET_CONNECT',
}

export class SignedNonceDto extends NonceDto {
  @ApiProperty({
    description: 'Signature of wallet for nonce',
  })
  @IsNotEmpty()
  @IsString()
  signature: string;

  @ApiProperty({
    description: 'Provider of wallet',
  })
  @IsNotEmpty()
  provider: WalletProviders;
}
