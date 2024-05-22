import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { TokenService } from './token.service';
import { TokenDto } from '../../shared/common/auth/internal/dto/token.dto';
import { ApiErrorDto } from '../generic/dto';

@ApiTags('token')
@Controller('token')
export class TokenController {
  constructor(private tokenService: TokenService) {}

  @Post('exchange')
  @ApiOperation({
    summary: 'Exchange authorization token.',
    description: 'This method returns a new token based on the old token.',
  })
  @ApiCreatedResponse({
    type: TokenDto,
  })
  @ApiForbiddenResponse({
    type: ApiErrorDto,
  })
  exchange(@Body() tokenDto: TokenDto): Promise<TokenDto> {
    return this.tokenService.exchange(tokenDto, true);
  }

  @Get('/:name')
  @ApiOperation({
    summary: 'Create service authorization token.',
    description: 'This method returns a new token for internal service.',
  })
  @ApiCreatedResponse({
    type: TokenDto,
  })
  @ApiForbiddenResponse({
    type: ApiErrorDto,
  })
  createServiceToken(@Param('name') name: string): Promise<TokenDto> {
    return this.tokenService.createServiceToken(name);
  }
}
