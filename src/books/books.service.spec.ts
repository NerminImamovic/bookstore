import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { Book } from './book.entity';
import { BooksService } from './books.service';
import { UserRole } from '../users/enum';
import { CreateBookDto } from './dto';
import { repositoryMockFactory } from '../utils/mocks';

const authorId = 1;
const author: Partial<User> = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  password: 'password',
  id: authorId,
  role: UserRole.AUTHOR,
};

const adminId = 2;
const admin: Partial<User> = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  password: 'password',
  id: adminId,
  role: UserRole.ADMIN,
};

const bookId = 1;
const adminBookId = 2;
const validBook: Partial<Book> = {
  id: bookId,
  title: 'Book',
  isbn: '1234',
  publisher: 'Pub',
  publishedDate: new Date('2022-01-01'),
  author: author as User,
};

const authorCreateBookDto: CreateBookDto = {
  title: 'Book',
  isbn: '1234',
  publisher: 'Pub',
  authorId: authorId,
  publishedDate: new Date('2022-01-01'),
};

const adminCreateBookDto: CreateBookDto = {
  title: 'Book',
  isbn: '1234',
  publisher: 'Pub',
  authorId: adminId,
  publishedDate: new Date('2022-01-01'),
};

const adminBook = {
  ...validBook,
  id: adminBookId,
  author: admin as User,
};

describe('BooksService', () => {
  let service: BooksService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(Book),
          useFactory: jest.fn(() => ({
            create: jest.fn().mockResolvedValue(validBook),
            save: jest.fn().mockResolvedValue(validBook),
            delete: jest.fn().mockResolvedValue(true),
            findOne: jest.fn().mockImplementation(({ where: { id } }) => {
              if (id === bookId) {
                return new Promise((resolve) => {
                  resolve(validBook);
                });
              }

              if (id === adminBookId) {
                return new Promise((resolve) => {
                  resolve(adminBook);
                });
              }
            }),
          })),
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create book', () => {
    it('should create for author', async () => {
      jest
        .spyOn(UsersService.prototype, 'getUser')
        .mockResolvedValue(author as User);

      const { id } = await service.createBook({
        createBookDto: authorCreateBookDto,
        authorizedUserId: authorId,
      });

      expect(id).toBe(bookId);
    });

    it('should create for admin', async () => {
      jest
        .spyOn(UsersService.prototype, 'getUser')
        .mockResolvedValue(admin as User);

      const { id } = await service.createBook({
        createBookDto: adminCreateBookDto,
        authorizedUserId: adminId,
      });

      expect(id).toBe(bookId);
    });

    it('should create for author by admin', async () => {
      jest
        .spyOn(UsersService.prototype, 'getUser')
        .mockResolvedValueOnce(admin as User)
        .mockResolvedValueOnce(author as User);

      const { id } = await service.createBook({
        createBookDto: authorCreateBookDto,
        authorizedUserId: adminId,
      });

      expect(id).toBe(bookId);
    });

    it('could create for author by another author', async () => {
      jest
        .spyOn(UsersService.prototype, 'getUser')
        .mockResolvedValueOnce(author as User)
        .mockResolvedValueOnce(admin as User);

      try {
        await service.createBook({
          createBookDto: adminCreateBookDto,
          authorizedUserId: authorId,
        });
      } catch (err) {
        expect(err.message).toBe(`Author can't create a book for someone else`);
      }
    });
  });

  describe('get book', () => {
    it('should get a book by id', async () => {
      const book = await service.getBook(bookId);

      expect(book).toStrictEqual(validBook);
    });

    it('should fail getting book by id', async () => {
      try {
        await service.getBook(5);
      } catch (err) {
        expect(err.message).toBe('A book with that id does not exist.');
      }
    });
  });

  describe('update book', () => {
    it('should update book for author', async () => {
      jest
        .spyOn(UsersService.prototype, 'getUser')
        .mockResolvedValue(author as User);

      expect(
        await service.updateBook({
          bookId,
          updateBookDto: {
            title: 'Book1',
          },
          authorizedUserId: authorId,
        }),
      ).toBe(true);
    });

    it('should update book for admin', async () => {
      jest
        .spyOn(UsersService.prototype, 'getUser')
        .mockResolvedValue(admin as User);

      expect(
        await service.updateBook({
          bookId: adminBookId,
          updateBookDto: {
            title: 'Book1',
          },
          authorizedUserId: adminId,
        }),
      ).toBe(true);
    });

    it('should update book for author by admin', async () => {
      jest
        .spyOn(UsersService.prototype, 'getUser')
        .mockResolvedValue(admin as User);
      jest.spyOn(service, 'getBook').mockResolvedValue(validBook as Book);

      expect(
        await service.updateBook({
          bookId,
          updateBookDto: {
            title: 'Book1',
          },
          authorizedUserId: adminId,
        }),
      ).toBe(true);
    });

    it('could not update author by author', async () => {
      jest
        .spyOn(UsersService.prototype, 'getUser')
        .mockClear()
        .mockResolvedValueOnce(author as User);
      jest.spyOn(service, 'getBook').mockResolvedValue(validBook as Book);

      try {
        await service.updateBook({
          bookId,
          updateBookDto: {
            authorId: 6,
          },
          authorizedUserId: authorId,
        });
      } catch (err) {
        expect(err.message).toBe(`Author can't change authors on their books`);
      }
    });

    it('could not update for author by another author', async () => {
      jest
        .spyOn(UsersService.prototype, 'getUser')
        .mockResolvedValueOnce(author as User)
        .mockResolvedValueOnce(admin as User);
      jest.spyOn(service, 'getBook').mockResolvedValue(validBook as Book);

      try {
        await service.updateBook({
          bookId: adminBookId,
          updateBookDto: {
            title: 'Book1',
          },
          authorizedUserId: authorId,
        });
      } catch (err) {
        expect(err.message).toBe(`Author can't modify someone else's books`);
      }
    });
  });

  describe('delete book', () => {
    it('should delete book by admin', async () => {
      jest.spyOn(service, 'getBook').mockResolvedValue(validBook as Book);
      jest
        .spyOn(UsersService.prototype, 'getUser')
        .mockResolvedValue(admin as User);

      expect(
        await service.deleteBook({
          bookId,
          authorizedUserId: adminId,
        }),
      ).toBe(true);
    });

    it('should delete own book by author', async () => {
      jest.spyOn(service, 'getBook').mockResolvedValue(validBook as Book);
      jest
        .spyOn(UsersService.prototype, 'getUser')
        .mockResolvedValue(author as User);

      expect(
        await service.deleteBook({
          bookId,
          authorizedUserId: authorId,
        }),
      ).toBe(true);
    });

    it('could not delete books from another author by author', async () => {
      jest.spyOn(service, 'getBook').mockResolvedValue(adminBook as Book);
      jest
        .spyOn(UsersService.prototype, 'getUser')
        .mockResolvedValue(author as User);

      try {
        await service.deleteBook({
          bookId,
          authorizedUserId: authorId,
        });
      } catch (err) {
        expect(err.message).toBe(
          'Author cannot delete books from another authors.',
        );
      }
    });
  });
});
