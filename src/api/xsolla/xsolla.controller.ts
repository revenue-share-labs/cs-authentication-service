import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { XsollaService } from './xsolla.service';
import { TokenDto } from '../../shared/common/auth/internal/dto/token.dto';

@ApiTags('xsolla')
@Controller('xsolla')
export class XsollaController {
  constructor(private xsollaService: XsollaService) {}

  @Post('complete')
  @ApiOperation({
    summary: 'Authorization by xsolla login.',
    description:
      'This method returns a token of authorization by the xsolla login.',
  })
  @ApiCreatedResponse({
    type: TokenDto,
  })
  issue(@Body() xsollaTokenDto: TokenDto): Promise<TokenDto> {
    return this.xsollaService.exchange(xsollaTokenDto);
  }
}
