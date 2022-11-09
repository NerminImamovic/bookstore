import { CreateBookDto } from '../dto/create-book.dto';
import { UpdateBookDto } from '../dto/update-book.dto';

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
