export class TokenPayloadDto {
  sub: string;
  type: 'internal' | 'external' | 'partner';
}
