import { BookAuthor } from '../../users/types';

export class BookResponseDto {
  id: number;
  title: string;
  isbn: string;
  publishedDate: Date;
  publisher: string;
  author: BookAuthor;
}
