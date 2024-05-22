import { GetOrCreateUserDto } from './get-or-create-user.dto';
import { WalletProviders } from '../../../../api/wallet/dto/signed-nonce.dto';

describe('GetOrCreateUser', () => {
  it('check instanceof dto.', async () => {
    const getOrCreateUserDto = new GetOrCreateUserDto();
    expect(getOrCreateUserDto).toBeInstanceOf(GetOrCreateUserDto);
  });
  it('check fields of dto.', () => {
    const tokenPayloadDto: GetOrCreateUserDto = {
      email: '1',
      address: 'internal',
      provider: WalletProviders.META_MASK,
    };
    expect({
      email: '1',
      address: 'internal',
      provider: WalletProviders.META_MASK,
    }).toEqual(tokenPayloadDto);
  });
});
