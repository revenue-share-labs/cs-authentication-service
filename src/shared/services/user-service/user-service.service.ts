import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { GetOrCreateUserDto } from './dto/get-or-create-user.dto';
import { UserDto } from './dto/user.dto';
import { AuthStorageService } from '../storage/auth-storage.service';
import { ApiKeyDto } from '../../../api/partner/dto/api-key.dto';

@Injectable()
export class UserServiceService {
  constructor(
    private readonly httpService: HttpService,
    private readonly authStorageService: AuthStorageService,
  ) {}

  private readonly logger = new Logger(UserServiceService.name);

  async getUserByApiKey({ apiKey }: ApiKeyDto): Promise<UserDto> {
    const { data }: { data: UserDto } = await this.httpService.axiosRef.get(
      `/api-key/${apiKey}`,
      {
        headers: {
          Authorization: `Bearer ${this.authStorageService.serviceJwt}`,
        },
      },
    );
    return data;
  }

  async getOrCreateUser({
    email,
    address,
    provider,
  }: GetOrCreateUserDto): Promise<UserDto> {
    let user: UserDto;
    this.logger.debug(
      `Get or create user with ${
        email ? `email:${email}` : `address: ${address}`
      }`,
    );
    if (email || address) {
      const body = email
        ? {
            email,
          }
        : {
            address,
            provider,
          };
      const { data } = await this.httpService.axiosRef.post('/', body, {
        headers: {
          Authorization: `Bearer ${this.authStorageService.serviceJwt}`,
        },
      });
      this.logger.debug(`Get user with id: ${data.id}`);
      user = data;
    }
    return user;
  }
}
