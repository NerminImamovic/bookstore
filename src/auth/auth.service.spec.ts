import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { Book } from '../books/book.entity';
import { JwtService } from '@nestjs/jwt';
import { repositoryMockFactory } from '../utils/mocks';
import { UserRole } from '../users/enum';

const email = 'john.doe@example.com';
const password = 'password';
const token = 'token';

describe('AuthService', () => {
  let service: AuthService;

  beforeAll(() => {
    process.env.JWT_SECRET = 'secret';
  });

  beforeEach(async () => {
    jest.resetModules();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        AuthService,
        JwtService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(Book),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should create accessToken', async () => {
      jest.spyOn(UsersService.prototype, 'findByEmail').mockResolvedValueOnce({
        firstName: 'John',
        lastName: 'Doe',
        email,
        password,
        id: 1,
        isActive: true,
        role: UserRole.ADMIN,
        validatePassword: jest.fn().mockResolvedValue(true),
      } as unknown as User);

      jest.spyOn(JwtService.prototype, 'sign').mockReturnValue(token);

      const { accessToken } = await service.login({ email, password });
      expect(accessToken).toBe(token);
    });

    it('should throw an Unauthroized error due to faling user validation', async () => {
      jest
        .spyOn(UsersService.prototype, 'findByEmail')
        .mockRejectedValueOnce('Error');

      try {
        await service.login({ email, password });
      } catch (err) {
        expect(err).not.toBe(undefined);
      }
    });
  });
});
