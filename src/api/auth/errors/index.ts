import { HttpException } from '@nestjs/common';

export class DuplicateUserException extends HttpException {
  name: 'DuplicateUserException';
}

export class PrismaNetworkException extends HttpException {
  name = 'PrismaNetworkException';
}

export class InvalidAuthenticationTokenException extends HttpException {
    name = 'InvalidAuthenticationTokenException';
  }