import { Module } from '@nestjs/common';
import { XsollaController } from './xsolla.controller';
import { XsollaService } from './xsolla.service';
import { UserServiceModule } from '../../shared/services/user-service/user-service.module';

@Module({
  imports: [UserServiceModule],
  controllers: [XsollaController],
  providers: [XsollaService],
})
export class XsollaModule {}
