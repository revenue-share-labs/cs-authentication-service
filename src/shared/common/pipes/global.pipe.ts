/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  PipeTransform,
  Injectable,
  BadRequestException,
  ArgumentMetadata,
} from '@nestjs/common';
import { ValidationError, validate } from 'class-validator';
import { TokenDto } from '../auth/internal/dto/token.dto';
import { plainToInstance } from 'class-transformer';
import {
  ApiErrorDto,
  ValidationApiErrorItemDto,
} from '../../../api/generic/dto';

@Injectable()
export class GlobalPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata): Promise<TokenDto> {
    if (metadata.type !== 'body') {
      return value;
    }

    const object = plainToInstance(metadata.metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const apiErrorDto: ApiErrorDto = {
        message: 'Invalid fields',
        errors: this.wrapValidationErrorsToApiErrors(errors, []),
      };
      throw new BadRequestException(apiErrorDto);
    }

    return value;
  }

  private wrapValidationErrorsToApiErrors(
    validationErrors: ValidationError[],
    validationApiErrors: ValidationApiErrorItemDto[],
    parent?: string,
  ): ValidationApiErrorItemDto[] {
    parent = parent ?? '';

    validationErrors.forEach((error) => {
      const errorChildren = error.children;
      const property = `${parent}${error.property}`;

      errorChildren && errorChildren.length !== 0
        ? this.wrapValidationErrorsToApiErrors(
            errorChildren,
            validationApiErrors,
            `${property}.`,
          )
        : validationApiErrors.push({
            invalidField: property,
            message: Object.values(error.constraints).join(', '),
          });
    });

    return validationApiErrors;
  }
}
