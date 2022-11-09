import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { Book } from './book.entity';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { repositoryMockFactory } from '../utils/mocks';

describe('BooksController', () => {
  let controller: BooksController;

  beforeAll(() => {
    process.env.JWT_SECRET = 'secret';
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        BooksService,
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

    controller = module.get<BooksController>(BooksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
