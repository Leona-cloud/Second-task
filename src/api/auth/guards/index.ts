import { UserService } from '@/api/user/services';
import { jwtSecret } from '@/config';
import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { DataStoredInToken, RequestWithUser } from '../interfaces';
import { UserNotFoundException } from '@/api/user/errors';
import {
  InvalidAuthenticationTokenException,
  PrismaNetworkException,
} from '../errors';
import logger from 'moment-logger';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as RequestWithUser;
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new InvalidAuthenticationTokenException(
        'Invalid token or token expired',
        HttpStatus.UNAUTHORIZED,
      );
    }
    try {
      const payload: DataStoredInToken = await this.jwtService.verifyAsync(
        token,
        {
          secret: jwtSecret,
        },
      );

      const user = await this.userService.findUserById(payload.sub);
      if (!user) {
        throw new UserNotFoundException(
          'User Unauthorized',
          HttpStatus.UNAUTHORIZED,
        );
      }
      request.user = user;
    } catch (error) {
      logger.error(error);
      switch (true) {
        case error instanceof UserNotFoundException: {
          throw error;
        }
        case error.name == 'PrismaClientKnownRequestError': {
          throw new PrismaNetworkException(
            'Unable to process request. Please try again',
            HttpStatus.SERVICE_UNAVAILABLE,
          );
        }

        default: {
          throw new InvalidAuthenticationTokenException(
            'Your session is unauthorized or expired',
            HttpStatus.UNAUTHORIZED,
          );
        }
      }
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
