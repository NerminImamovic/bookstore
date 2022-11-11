import { MigrationInterface, QueryRunner } from 'typeorm';

import { User } from '../src/users/user.entity';
import { Book } from '../src/books/book.entity';

import dataSource from '../typeOrm.config';
import { UserRole } from '../src/users/enum';

export class DatabaseSeeder1668004332344 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const usersRepository = dataSource.getRepository(User);
    const booksRepository = dataSource.getRepository(Book);

    const admin1Email = 'admin@example.com';
    const admin2Email = 'admin.second@example.com';
    const admin3Email = 'admin.inactive@example.com';

    const author1Email = 'john.doe@example.com';
    const author2Email = 'joe.doe@example.com';
    const author3Email = 'author.inactive@example.com';

    const users: Partial<User>[] = [
      {
        firstName: 'Admin',
        lastName: 'First',
        password: 'password',
        role: UserRole.ADMIN,
        email: admin1Email,
        isActive: true,
      },
      {
        firstName: 'Admin',
        lastName: 'Second',
        password: 'password',
        email: admin2Email,
        role: UserRole.ADMIN,
        isActive: true,
      },
      {
        firstName: 'Admin',
        lastName: 'Inactive',
        password: 'password',
        role: UserRole.ADMIN,
        email: admin3Email,
        isActive: false,
      },
      {
        firstName: 'John',
        lastName: 'Doe',
        password: 'password',
        role: UserRole.AUTHOR,
        email: author1Email,
        isActive: true,
      },
      {
        firstName: 'Joe',
        lastName: 'Doe',
        password: 'password',
        role: UserRole.AUTHOR,
        email: author2Email,
        isActive: true,
      },
      {
        firstName: 'Inactive',
        lastName: 'Author',
        password: 'password',
        role: UserRole.AUTHOR,
        email: author3Email,
        isActive: true,
      },
    ];

    const usersToBeAdded = usersRepository.create(users);
    const addedUsers = await usersRepository.save(usersToBeAdded);

    const books: Partial<Book>[] = [
      {
        title: 'Book 1',
        publisher: 'Publisher',
        publishedDate: new Date('2022-01-15'),
        isbn: '1234567890',
        author: addedUsers.find((user) => user.email === admin1Email) as User,
      },
      {
        title: 'Book 2',
        publisher: 'Publisher',
        publishedDate: new Date('2022-01-15'),
        isbn: '1234567891',
        author: addedUsers.find((user) => user.email === admin2Email) as User,
      },
      {
        title: 'Book 3',
        publisher: 'Publisher',
        publishedDate: new Date('2022-01-15'),
        isbn: '1234567892',
        author: addedUsers.find((user) => user.email === admin3Email) as User,
      },
      {
        title: 'Book 4',
        publisher: 'Publisher',
        publishedDate: new Date('2022-01-15'),
        isbn: '1234567893',
        author: addedUsers.find((user) => user.email === author1Email) as User,
      },
      {
        title: 'Book 6',
        publisher: 'Publisher',
        publishedDate: new Date('2022-01-15'),
        isbn: '1234567893',
        author: addedUsers.find((user) => user.email === author1Email) as User,
      },
      {
        title: 'Book 7',
        publisher: 'Publisher',
        publishedDate: new Date('2022-01-15'),
        isbn: '1234567833',
        author: addedUsers.find((user) => user.email === author2Email) as User,
      },
      {
        title: 'Book 7',
        publisher: 'Publisher',
        publishedDate: new Date('2022-01-15'),
        isbn: '1234567833',
        author: addedUsers.find((user) => user.email === author1Email) as User,
      },
      {
        title: 'Book 7',
        publisher: 'Publisher',
        publishedDate: new Date('2022-01-15'),
        isbn: '1234567833',
        author: addedUsers.find((user) => user.email === author3Email) as User,
      },
    ];

    const booksToBeAdded = booksRepository.create(books);
    await booksRepository.save(booksToBeAdded);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // do nothing
  }
}
