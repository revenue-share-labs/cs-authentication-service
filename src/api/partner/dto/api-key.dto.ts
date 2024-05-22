import { ApiProperty } from '@nestjs/swagger';

export class ApiKeyDto {
  @ApiProperty({ description: 'Api key of partner' })
  readonly apiKey: string;
}
