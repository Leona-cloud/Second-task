import { PrismaService } from '@/modules/core/prisma/services';
import { HttpStatus, Injectable } from '@nestjs/common';
import { UserNotFoundException } from '../errors';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findUserById(id: string) {
    return await this.prisma.user.findUnique({
      where: {
        userId: id,
      },
    });
  }

  async getUser(id: string, user: User) {
    const userExists = await this.prisma.user.findUnique({
      where: {
        userId: id,
      },
      include: {
        organisations: {
          include: {
            organisation: {
              include: {
                users: true,
              },
            },
          },
        },
      },
    });

    if (!userExists) {
      throw new UserNotFoundException('User not found', HttpStatus.BAD_REQUEST);
    }

    const isAllowedToView =
      userExists.userId === user.userId ||
      userExists.organisations.some((orgs) =>
        orgs.organisation.users.some((u) => u.userId === user.userId),
      );

    if (!isAllowedToView) {
      throw new UserNotFoundException('User not fund', HttpStatus.BAD_REQUEST);
    }

    return {
      status: 'success',
      message: 'User fetched successfully',
      data: {
        userId: userExists.userId,
        firstName: userExists.firstName,
        lastName: userExists.lastName,
        email: userExists.email,
        phone: userExists.phone,
      },
    };
  }

 
}
