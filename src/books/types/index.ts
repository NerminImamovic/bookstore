import { BookAuthor } from '../../users/types';
import { CreateBookDto, UpdateBookDto } from '../dto';

export type CreateBookOptions = {
  authorizedUserId: number;
  createBookDto: CreateBookDto;
};

export type UpdateBookOptions = {
  bookId: number;
  authorizedUserId: number;
  updateBookDto: UpdateBookDto;
};

export type DeleteBookOptions = {
  bookId: number;
  authorizedUserId: number;
};

export type UserBook = {
  id: number;
  title: string;
  isbn: string;
  publishedDate: Date;
  publisher: string;
};

export class BookResponse {
  id: number;
  title: string;
  isbn: string;
  publishedDate: Date;
  publisher: string;
  author: BookAuthor;
}
