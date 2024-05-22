import { Module } from '@nestjs/common';
import { UserServiceModule } from '../../shared/services/user-service/user-service.module';
import { PartnerController } from './partner.controller';
import { PartnerService } from './partner.service';

@Module({
  imports: [UserServiceModule],
  controllers: [PartnerController],
  providers: [PartnerService],
})
export class PartnerModule {}
