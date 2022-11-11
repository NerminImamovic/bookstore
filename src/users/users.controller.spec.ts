import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from '../utils/mocks';
import { Book } from '../books/book.entity';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserRole } from './enum';

const validUserId = 1;
const validCreateUserDto = {
  firstName: 'user',
  lastName: 'author',
  email: 'user.author@example.com',
  password: 'password',
  isActive: true,
  role: UserRole.AUTHOR,
};
const validUserResponseDto = {
  id: validUserId,
  firstName: 'user',
  lastName: 'author',
  email: 'user.author@example.com',
  isActive: true,
  role: UserRole.AUTHOR,
  books: [],
};
const validUser: Partial<User> = {
  ...validUserResponseDto,
  password: 'password',
};

describe('UsersController', () => {
  let controller: UsersController;

  beforeAll(() => {
    process.env.JWT_SECRET = 'secret';
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
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

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create user', () => {
    it('should create a user', async () => {
      jest
        .spyOn(UsersService.prototype, 'createUser')
        .mockResolvedValue(validUser as User);

      const { id } = await controller.createUser(validCreateUserDto);

      expect(id).toBe(validUserId);
    });
  });

  describe('get users', () => {
    it('should get users', async () => {
      jest
        .spyOn(UsersService.prototype, 'getUsers')
        .mockResolvedValue([validUser] as User[]);

      const users = await controller.getUsers();

      expect(users).toStrictEqual([validUserResponseDto]);
    });
  });

  describe('get user', () => {
    it('should get users', async () => {
      jest
        .spyOn(UsersService.prototype, 'getUser')
        .mockResolvedValue(validUser as User);

      const users = await controller.getUser(validUserId);

      expect(users).toStrictEqual(validUserResponseDto);
    });
  });
});
