import { BookAuthor } from '../../users/dto/book-author';

export class BookResponse {
  id: number;
  title: string;
  isbn: string;
  publishedDate: Date;
  publisher: string;
  author: BookAuthor;
}
