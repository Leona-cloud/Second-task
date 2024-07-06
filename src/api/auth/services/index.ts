import { PrismaService } from '@/modules/core/prisma/services';
import { HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { LoginDto, RegisterDto } from '../dtos';
import { DuplicateUserException } from '../errors';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  private async comparePassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async register(options: RegisterDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: options.email.trim(),
      },
    });

    if (user) {
      return {
        status: 'Bad Request',
        message: 'Registration unsuccessful',
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }

    const hashPassword = await this.hashPassword(options.password);

    const createUserOptions: Prisma.UserUncheckedCreateInput = {
      email: options.email.toLowerCase(),
      firstName: options.firstName,
      lastName: options.lastName,
      phone: options.phone,
      password: hashPassword,
    };

    const createUser = await this.prisma.user.create({
      data: {
        ...createUserOptions,
        organisations: {
          create: {
            role: 'CREATOR',
            organisation: {
              create: {
                name: `${options.firstName}'s Organisation`,
              },
            },
          },
        },
      },
    });

    const accessToken = await this.jwtService.signAsync({
      sub: createUser.userId,
    });

    return {
      status: 'success',
      message: 'Registration successful',
      data: {
        accessToken,
        user: {
          userId: createUser.userId,
          firstName: createUser.firstName,
          lastName: createUser.lastName,
          email: createUser.email,
          phone: createUser.phone,
        },
      },
    };
  }

  async login(options: LoginDto) {
    const userExists = await this.prisma.user.findUnique({
      where: {
        email: options.email,
      },
    });

    if (!userExists) {
      return {
        status: 'Bad Request',
        message: 'Authentication failed',
        statusCode: 401,
      };
    }

    const validatePassword = await this.comparePassword(
      options.password,
      userExists.password,
    );
    if (!validatePassword) {
      return {
        status: 'Bad Request',
        message: 'Authentication failed',
        statusCode: HttpStatus.UNAUTHORIZED,
      };
    }

    const accessToken = await this.jwtService.signAsync({
      sub: userExists.userId,
    });

    return {
      status: 'success',
      message: 'Login successful',
      data: {
        accessToken: accessToken,
        user: {
          userId: userExists.userId,
          firstName: userExists.firstName,
          lastName: userExists.lastName,
          email: userExists.email,
          phone: userExists.phone,
        },
      },
    };
  }
}
