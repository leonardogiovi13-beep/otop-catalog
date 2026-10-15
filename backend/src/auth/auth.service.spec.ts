import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: any;

  beforeEach(async () => {
    prismaService = {
      user: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should reject registration if username is too short', async () => {
    await expect(
      service.register({
        username: 'ab',
        email: 'test@example.com',
        password: 'password123',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should reject registration if email is invalid', async () => {
    await expect(
      service.register({
        username: 'validuser',
        email: 'invalid-email',
        password: 'password123',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should reject registration if password is shorter than 6 characters', async () => {
    await expect(
      service.register({
        username: 'validuser',
        email: 'test@example.com',
        password: '12345',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should successfully register a new user', async () => {
    prismaService.user.findUnique.mockResolvedValue(null);
    prismaService.user.create.mockResolvedValue({
      id: 1,
      username: 'somchai',
      email: 'somchai@example.com',
      password: 'hashed_password',
      fullName: 'สมชาย ใจดี',
      phone: '0812345678',
      role: 'USER',
    });

    const result = await service.register({
      username: 'somchai',
      email: 'somchai@example.com',
      password: 'mypassword123',
      fullName: 'สมชาย ใจดี',
      phone: '0812345678',
    });

    expect(result.message).toContain('สมัครสมาชิกสำเร็จ');
    expect(result.token).toBeDefined();
    expect(result.user.username).toBe('somchai');
    expect(result.user.role).toBe('USER');
  });

  it('should login fallback admin successfully', async () => {
    const result = await service.login({
      username: 'admin',
      password: '1234',
    });

    expect(result.user.role).toBe('ADMIN');
    expect(result.token).toBeDefined();
  });
});
