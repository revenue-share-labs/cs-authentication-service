import { ApiProperty } from '@nestjs/swagger';

export class NonceDto {
  @ApiProperty({ description: 'Nonce which generated' })
  nonce: string;
}
