import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { Module } from '@nestjs/common';

@Module({ controllers: [TokenController], providers: [TokenService] })
export class TokenModule {}
