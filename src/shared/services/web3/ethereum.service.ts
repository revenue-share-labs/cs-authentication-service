import { Injectable, Logger } from '@nestjs/common';
import { ethers } from 'ethers';
import { hashMessage } from 'ethers/lib/utils';

@Injectable()
export class EthereumService {
  private readonly logger = new Logger(EthereumService.name);

  validateSignature(
    signature: string,
    data: string,
    sourceAddress: string,
  ): void {
    this.logger.debug(`Validate signature of wallet:${sourceAddress}`);
    if (
      sourceAddress !==
      ethers.utils.recoverAddress(hashMessage(data), signature)
    ) {
      throw new Error('Source address is not equal to recovered');
    }
  }
}
