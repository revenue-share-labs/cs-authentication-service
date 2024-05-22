import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { TokenDto } from '../../shared/common/auth/internal/dto/token.dto';
import { PartnerService } from './partner.service';
import { ApiKeyDto } from './dto/api-key.dto';
import { ApiErrorDto } from '../generic/dto';

@ApiTags('partner')
@Controller('partner')
export class PartnerController {
  constructor(private partnerService: PartnerService) {}

  @Post('complete')
  @ApiOperation({
    summary: 'Authorization for partners by api key.',
    description:
      'This method returns a token of authorization for partners by api key.',
  })
  @ApiCreatedResponse({
    type: TokenDto,
  })
  @ApiNotFoundResponse({
    type: ApiErrorDto,
    description: 'User with api key not found',
  })
  @ApiForbiddenResponse({
    type: ApiErrorDto,
    description: 'Authorization by api key error.',
  })
  complete(@Body() apiKeyDto: ApiKeyDto): Promise<TokenDto> {
    return this.partnerService.complete(apiKeyDto);
  }
}
