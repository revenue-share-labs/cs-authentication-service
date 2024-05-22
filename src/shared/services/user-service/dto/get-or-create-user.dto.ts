import { WalletProviders } from '../../../../api/wallet/dto/signed-nonce.dto';

export class GetOrCreateUserDto {
  readonly email?: string;
  readonly address?: string;
  readonly provider?: WalletProviders;
}
