import { HttpException } from '@nestjs/common';

export class UserNotFoundException extends HttpException {
  name = 'UserNotFoundException';
}