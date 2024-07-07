import { HttpStatus, INestApplication } from '@nestjs/common';
import { PrismaService } from '../src/modules/core/prisma/services/index';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/modules/index';
import * as request from 'supertest';
import * as bcrypt from 'bcryptjs';

describe(' AuthService (E2E)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prismaService = moduleFixture.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    await prismaService.userOrganisation.deleteMany();
    await prismaService.organisation.deleteMany();
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST auth/register', () => {
    it('should register a user successfully with a default organization', async () => {
      const registerUser = {
        email: 'John@gmail.com',
        password: 'pass1234',
        phone: '09088767890',
        firstName: 'John',
        lastName: 'Doe',
      };

      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(registerUser)
        .expect(HttpStatus.CREATED);

      expect(response.body).toMatchObject({
        status: 'success',
        message: 'Registration successful',
        data: {
          accessToken: expect.any(String),
          user: {
            email: 'john@gmail.com',
            phone: '09088767890',
            firstName: 'John',
            lastName: 'Doe',
          },
        },
      });

      const user = await prismaService.user.findUnique({
        where: { email: 'john@gmail.com' },
        include: { organisations: { include: { organisation: true } } },
      });

      expect(user?.organisations[0].organisation.name).toEqual(
        "John's Organisation",
      );
    });

    it('should fail if required fields are missing', async () => {
      const invalidRegDetails = {
        password: 'pass345',
        phone: '09087651098',
      };

     const response =  await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(invalidRegDetails)
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);


    
        
    });

    it('should fail if duplicate email exists', async () => {
      const hashPassword = await bcrypt.hash('pass1234', 10);

      await prismaService.user.create({
        data: {
          email: 'jane@gmail.com',
          firstName: 'jane',
          lastName: 'hannah',
          phone: '09077678909',
          password: hashPassword,
        },
      });

      const duplicateUser = {
        email: 'jane@gmail.com',
        firstName: 'janeet',
        lastName: 'hannah',
        phone: '09077678909',
        password: 'pass1234',
      };

      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(duplicateUser)
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body).toMatchObject({
        status: 'Bad Request',
        message: 'Registration unsuccessful',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    });
  });

  describe('POST auth/login', () => {
    it('it should log the user in successfully', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await prismaService.user.create({
        data: {
          email: 'johnDoe@example.com',
          firstName: 'John',
          lastName: 'Doe',
          phone: '09076543210',
          password: hashedPassword,
        },
      });

      const loginUser = {
        email: 'johnDoe@example.com',
        password: 'password123',
      };

      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send(loginUser)
        .expect(HttpStatus.OK);

      expect(response.body).toMatchObject({
        status: 'success',
        message: 'Login successful',
        data: {
          accessToken: expect.any(String),
          user: {
            email: 'johnDoe@example.com',
            firstName: 'John',
            lastName: 'Doe',
            phone: '09076543210',
          },
        },
      });

      expect(response.body.data.accessToken).toBeDefined();
    });
  });
});
