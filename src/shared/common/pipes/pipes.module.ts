import { Global, Module } from '@nestjs/common';
import { GlobalPipe } from './global.pipe';

@Global()
@Module({
  providers: [GlobalPipe],
  exports: [GlobalPipe],
})
export class PipesModule {}
