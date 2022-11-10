import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { Book } from './book.entity';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { repositoryMockFactory } from '../utils/mocks';
import { UserRole } from '../users/enum';
import { BookResponseDto } from './dto';

const authorId = 1;
const author: Partial<User> = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  password: 'password',
  isActive: true,
  id: authorId,
  role: UserRole.AUTHOR,
};

const createBookDto = {
  title: 'Book',
  isbn: '1234',
  publisher: 'Pub',
  publishedDate: new Date('2022-01-01'),
  authorId,
};

const bookId = 1;
const validBook: Partial<Book> = {
  id: bookId,
  ...createBookDto,
  author: author as User,
};

const validBookResponse: BookResponseDto = {
  id: bookId,
  title: 'Book',
  isbn: '1234',
  publisher: 'Pub',
  publishedDate: new Date('2022-01-01'),
  author: {
    id: authorId,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    role: UserRole.AUTHOR,
  },
};

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

  describe('create user', () => {
    it('should create a user', async () => {
      jest
        .spyOn(BooksService.prototype, 'createBook')
        .mockResolvedValue(validBook as Book);

      const { id } = await controller.createBook(
        { user: { userId: 1 } },
        createBookDto,
      );

      expect(id).toBe(bookId);
    });
  });

  describe('get users', () => {
    it('should get users', async () => {
      jest
        .spyOn(BooksService.prototype, 'getBooks')
        .mockResolvedValue([validBook] as Book[]);

      const books = await controller.getBooks();

      expect(books).toStrictEqual([validBookResponse]);
    });
  });

  describe('get book', () => {
    it('should get users', async () => {
      jest
        .spyOn(BooksService.prototype, 'getBook')
        .mockResolvedValue(validBook as Book);

      const book = await controller.getBook(bookId);

      expect(book).toStrictEqual(validBookResponse);
    });
  });
});
