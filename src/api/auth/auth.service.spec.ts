import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './services';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/services';
import { UnauthorizedException } from '@nestjs/common';
import { PrismaModule } from '@/modules/core/prisma';
import { PrismaService } from '@/modules/core/prisma/services';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [
        AuthService,
        JwtService,
        UserService,
        PrismaService,
        {
          provide: JwtService,
          useValue: {
            verify: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            findUserById: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userService = module.get<UserService>(UserService);
  });

  it('should throw an error if token is invalid', async () => {
    const expiredToken = 'expiredToken';
    (jwtService.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Token is expired');
    });

    await expect(authService.validateToken(expiredToken)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should return user details if token is valid', async () => {
    const token = 'valid-token';
    const userId = 'userId';
    const user = {
      userId,
      email: 'user1@email.com',
      firstName: 'user1',
      lastName: 'user1',
      phone: '09099876546',
      password: 'pass456',
    };
    (userService.findUserById as jest.Mock).mockResolvedValue(user);
    (jwtService.verify as jest.Mock).mockReturnValue({ userId });

    const result = await authService.validateToken(token);

    expect(result).toEqual(user);
  });
});
