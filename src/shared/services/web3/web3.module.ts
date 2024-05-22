import { Global, Module } from '@nestjs/common';
import { EthereumService } from './ethereum.service';

@Global()
@Module({
  providers: [EthereumService],
  exports: [EthereumService],
})
export class Web3Module {}
