import { PrismaService } from '@/modules/core/prisma/services';
import { HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from '../dtos';
import { DuplicateUserException } from '../errors';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async register(options: RegisterDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: options.email.trim(),
      },
    });

    if (user) {
      throw new DuplicateUserException(
        'An account with this email already exists',
        HttpStatus.BAD_REQUEST,
      );
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
            organisation: {
              create: {
                name: `${options.firstName}'s Organisation`,
              },
            },
          },
        },
      },
    });

    return {
      status: 'success',
      message: 'Registration successful',
      data: {
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
}
