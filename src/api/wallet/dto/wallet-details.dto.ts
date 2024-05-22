import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class WalletDetailsDto {
  @ApiProperty({ description: 'Public key of wallet' })
  @IsNotEmpty()
  @IsString()
  publicKey: string;
}
