import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { LogoutService } from './logout.service';
import { TokenDto } from '../../shared/common/auth/internal/dto/token.dto';
import { ApiErrorDto } from '../generic/dto';

@ApiTags('logout')
@Controller('logout')
export class LogoutController {
  constructor(private logoutService: LogoutService) {}

  @Post()
  @ApiOperation({
    summary: 'Logout.',
    description: 'This method remove token from DB and logout user.',
  })
  @ApiOkResponse({
    type: TokenDto,
  })
  @ApiForbiddenResponse({
    type: ApiErrorDto,
  })
  logout(@Body() tokenDto: TokenDto): Promise<void> {
    return this.logoutService.logout(tokenDto);
  }
}
