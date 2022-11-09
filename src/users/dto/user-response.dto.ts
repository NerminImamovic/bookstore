import { UserBook } from '../../books/dto/user-book.dto';
import { UserRole } from '../enum';

export class UserResponseDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  books: UserBook[];
}
