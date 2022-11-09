import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import { Book } from './book.entity';
import {
  CreateBookOptions,
  DeleteBookOptions,
  UpdateBookOptions,
} from './types';
import { UserRole } from '../users/enum';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
    private userService: UsersService,
  ) {}

  public getAllBooks() {
    return this.booksRepository.find({ relations: ['author'] });
  }

  public async getBook(bookId: number) {
    try {
      const book = await this.booksRepository.findOne({
        relations: ['author'],
        where: { id: bookId },
      });

      if (!book) {
        throw new NotFoundException('A book with that id does not exist.');
      }

      return book;
    } catch (err) {
      throw err;
    }
  }

  public async createBook({
    createBookDto,
    authorizedUserId,
  }: CreateBookOptions) {
    const user = await this.userService.getUser(authorizedUserId);
    const author = await this.userService.getUser(createBookDto.authorId);

    if (
      user.role === UserRole.AUTHOR &&
      createBookDto.authorId !== authorizedUserId
    ) {
      throw new ForbiddenException(
        `Author can't create a book for someone else`,
      );
    }

    const book = await this.booksRepository.create({
      ...createBookDto,
      author,
    });
    book.author = author;

    await this.booksRepository.save(book);

    return {
      id: book.id,
    };
  }

  public async updateBook({
    bookId,
    authorizedUserId,
    updateBookDto,
  }: UpdateBookOptions) {
    const user = await this.userService.getUser(authorizedUserId);
    const book = await this.getBook(bookId);

    if (user.role === UserRole.AUTHOR && book.author.id !== authorizedUserId) {
      throw new ForbiddenException(`Author can't modify someone else's books`);
    }

    if (
      user.role === UserRole.AUTHOR &&
      updateBookDto?.authorId &&
      updateBookDto?.authorId !== authorizedUserId
    ) {
      throw new ForbiddenException(
        `Author can't change authors on their books`,
      );
    }

    const updatedBook = { ...book, ...updateBookDto };

    await this.booksRepository.save(updatedBook);

    return true;
  }

  public async deleteBook({
    bookId,
    authorizedUserId,
  }: DeleteBookOptions): Promise<boolean> {
    try {
      const user = await this.userService.getUser(authorizedUserId);
      const book = await this.getBook(bookId);

      if (
        user.role === UserRole.AUTHOR &&
        book.author.id !== authorizedUserId
      ) {
        throw new ForbiddenException(
          'Author cannot delete books from another authors.',
        );
      }

      await this.booksRepository.delete(bookId);

      return true;
    } catch (error) {
      throw error;
    }
  }
}
