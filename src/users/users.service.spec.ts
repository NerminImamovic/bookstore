import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Book } from '../books/book.entity';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto';
import { UserRole } from './enum';
import { repositoryMockFactory } from '../utils/mocks';

const validUserId = 1;
const createUserDto: CreateUserDto = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  password: 'password',
  role: UserRole.AUTHOR,
};
const validUser: Partial<User> = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  isActive: true,
  id: validUserId,
  role: UserRole.AUTHOR,
  books: [],
};

const inactiveAdminId = 2;
const inactiveAdmin: Partial<User> = {
  firstName: 'Inactive',
  lastName: 'Admin',
  email: 'inactive.admin@example.com',
  password: 'password',
  id: inactiveAdminId,
  role: UserRole.ADMIN,
  isActive: false,
};

const activeAdminId = 2;
const activeAdmin: Partial<User> = {
  firstName: 'Inactive',
  lastName: 'Admin',
  email: 'inactive.admin@example.com',
  password: 'password',
  id: activeAdminId,
  role: UserRole.ADMIN,
  isActive: true,
};

describe('UsersService', () => {
  let service: UsersService;

  beforeAll(() => {
    process.env.JWT_SECRET = 'secret';
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: jest.fn(() => ({
            create: jest.fn().mockImplementation((user) => {
              return user.email === 'duplicated.email@example.com'
                ? {
                    ...validUser,
                    email: user.email,
                  }
                : validUser;
            }),
            save: jest.fn().mockImplementation((user) => {
              if (user.email === 'duplicated.email@example.com') {
                throw new Error('Duplicate entry ...');
              } else {
                return new Promise((resolve) => resolve(validUser));
              }
            }),
            find: jest.fn().mockRejectedValue(validUser),
            delete: jest.fn().mockResolvedValue(true),
            findOne: jest.fn().mockImplementation(({ where: { id } }) => {
              const users = [validUser, inactiveAdmin, activeAdmin];
              const user = users.find((user) => user.id === id);

              if (user) {
                return new Promise((resolve) => {
                  resolve(validUser);
                });
              }
            }),
          })),
        },
        {
          provide: getRepositoryToken(Book),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create users', () => {
    it('should create a new user', async () => {
      const { id } = await service.createUser(createUserDto);

      expect(id).toBe(validUserId);
    });

    it('should fail creating a new user', async () => {
      try {
        await service.createUser({
          ...createUserDto,
          email: 'duplicated.email@example.com',
        });
      } catch (err) {
        expect(err.message).toBe('User with that email already exsists!');
      }
    });
  });

  describe('get user', () => {
    it('should get user by id', async () => {
      const user = await service.getUser(validUserId);

      expect(user).toStrictEqual(validUser);
    });

    it('should fail getting user by id', async () => {
      try {
        await service.getUser(5);
      } catch (err) {
        expect(err.message).toBe('A User with that id does not exist.');
      }
    });
  });

  describe('update user', () => {
    it('should update user', async () => {
      const result = await service.updateUser(validUserId, {
        firstName: 'Jay',
      });

      expect(result).toBe(true);
    });

    it('should fail user update', async () => {
      try {
        await service.updateUser(5, { firstName: 'Jay' });
      } catch (err) {
        expect(err.message).toBe('A User with that id does not exist.');
      }
    });
  });

  describe('deactivate user', () => {
    it('should deactivate user', async () => {
      const result = await service.dectivateUser(validUserId);

      expect(result).toBe(true);
    });
  });

  describe('delete user', () => {
    it('should delete user', async () => {
      const result = await service.deleteUser(validUserId);

      expect(result).toBe(true);
    });

    it('should delete inactive admin', async () => {
      jest.spyOn(service, 'getUser').mockResolvedValue(inactiveAdmin as User);

      const result = await service.deleteUser(inactiveAdminId);

      expect(result).toBe(true);
    });

    it('could not delete active admin', async () => {
      jest.spyOn(service, 'getUser').mockResolvedValue(activeAdmin as User);

      try {
        await service.deleteUser(activeAdminId);
      } catch (err) {
        expect(err.message).toBe(
          'It is not possible to delete acitve admin users.',
        );
      }
    });
  });
});
