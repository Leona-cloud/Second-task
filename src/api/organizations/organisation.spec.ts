import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationService } from './services';
import { PrismaModule } from '@/modules/core/prisma';
import { PrismaService } from '@/modules/core/prisma/services';
import { Organisation, User } from '@prisma/client';

describe('OrganizationService', () => {
  let organizationService: OrganizationService;
  let prismaService: Partial<PrismaService>;

  beforeEach(async () => {
    prismaService = {
      organisation: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        findUniqueOrThrow: jest.fn(),
        findFirst: jest.fn(),
        findFirstOrThrow: jest.fn(),
        create: jest.fn(),
        createMany: jest.fn(),
        createManyAndReturn: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn(),
      } as unknown as typeof prismaService.organisation,
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [
        OrganizationService,
        { provide: PrismaService, useValue: prismaService },
      ],
    }).compile();

    organizationService = module.get<OrganizationService>(OrganizationService);
  });

  it('should fetch organizations users belong to', async () => {
    const user: User = {
      userId: 'user1',
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'user@gmail.com',
      password: 'pass1234',
      phone: '09088765345',
    };

    const organisations: Organisation[] = [
      { orgId: '888', name: 'org1', description: 'new org' },
      { orgId: '909', name: 'secondOrg', description: '' },
    ];

    prismaService.organisation.findMany = jest
      .fn()
      .mockResolvedValue(organisations);

    const result = await organizationService.getUsersOrganizations(user);

    expect(prismaService.organisation.findMany).toHaveBeenCalledWith({
      where: {
        users: {
          some: {
            userId: user.userId,
            OR: [{ role: 'CREATOR' }, { role: 'MEMBER' }],
          },
        },
      },
    });

    expect(result).toEqual({
      status: 'success',
      message: 'Organizations fetched successfully',
      data: { organisations: organisations },
    });
  });

  it('should not allow users see organizations they do not belong to', async () => {
    const user: User = {
      userId: 'userId2',
      firstName: 'Adam',
      lastName: 'eve',
      email: 'user2@email.com',
      phone: '09088764567',
      password: 'password',
    };

    (prismaService.organisation.findMany as jest.Mock).mockResolvedValue([]);

    const result = await organizationService.getUsersOrganizations(user);

    expect(prismaService.organisation.findMany).toHaveBeenCalledWith({
      where: {
        users: {
          some: {
            userId: user.userId,
            OR: [{ role: 'CREATOR' }, { role: 'MEMBER' }],
          },
        },
      },
    });

    expect(result).toEqual({
      status: 'success',
      message: 'Organizations fetched successfully',
      data: {
        organisations: [],
      },
    });
  });
});
