import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { UserServiceModule } from '../../shared/services/user-service/user-service.module';

@Module({
  imports: [UserServiceModule],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
