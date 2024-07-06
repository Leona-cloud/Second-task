import { PrismaService } from '@/modules/core/prisma/services';
import { HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { addUserToOrganizationDto, createOrganizationDto } from '../dtos';

@Injectable()
export class OrganizationService {
  constructor(private prisma: PrismaService) {}

  async getUsersOrganizations(user: User) {
    const organizations = await this.prisma.organisation.findMany({
      where: {
        users: {
          some: {
            userId: user.userId,
            OR: [{ role: 'CREATOR' }, { role: 'MEMBER' }],
          },
        },
      },
    });

    return {
      status: 'success',
      message: 'Organizations fetched successfully',
      data: organizations,
    };
  }

  async getSingleOrganization(id: string) {
    const organizationExists = await this.prisma.organisation.findUnique({
      where: {
        orgId: id,
      },
    });

    if (!organizationExists) {
      return {
        status: 'Bad Request',
        message: 'Organization does not exist',
        statusCode: HttpStatus.UNAUTHORIZED,
      };
    }

    return {
      status: 'success',
      message: 'Organization fetched successfully',
      data: organizationExists,
    };
  }

  async createOrganization(options: createOrganizationDto, user: User) {
    const organization = await this.prisma.organisation.create({
      data: {
        name: options.name,
        description: options.description,
      },
    });

    if (!organization) {
      return {
        status: 'Bad Request',
        message: 'Client error',
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }

    const updatedOrganization = await this.prisma.userOrganisation.create({
      data: {
        userId: user.userId,
        organisationId: organization.orgId,
        role: 'CREATOR',
      },
    });

    return {
      status: 'success',
      message: 'Organization created successfully',
      data: organization,
    };
  }

  async addUserToOrganization(
    options: addUserToOrganizationDto,
    orgId: string,
    user: User,
  ) {
    const organizationExists = await this.prisma.organisation.findUnique({
      where: {
        orgId: orgId,
      },
      include: { users: true },
    });

    if (!organizationExists) {
      return {
        status: 'Bad Request',
        message: 'Organization does not exist',
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }

    //check if user belongs to org

    const userExists = await this.prisma.user.findUnique({
      where: {
        userId: options.userId,
      },
    });

    if (!userExists) {
      return {
        status: 'Bad Request',
        message: 'User does not exist',
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }

    const userBelongsToOrg = organizationExists.users.some(
      (OrgUser) => OrgUser.userId === user.userId,
    );

    if (!userBelongsToOrg) {
      return {
        status: 'Bad Request',
        message: 'User does not have the permission to add members',
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }

    const updateOrg = await this.prisma.userOrganisation.create({
      data: {
        userId: userExists.userId,
        organisationId: organizationExists.orgId,
        role: 'MEMBER',
      },
    });

    if (!updateOrg) {
      return {
        status: 'Bad Request',
        message: 'Failed to add user to organization',
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }

    return {
      status: 'success',
      message: 'User added to organisation successfully',
    };
  }
}
