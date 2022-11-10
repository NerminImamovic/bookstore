import { UserBook } from '../../books/types/index';
import { UserRole } from '../enum';

export class UserResponseDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  role: UserRole;
  books: UserBook[];
}
