import { UpdateUserDto } from '../dto';

export type UpdateUserOptions = {
  userId: number;
  updateUserDto: UpdateUserDto;
};

export type DeleteUserOptions = {
  authorizedUserId: number;
  userId: number;
};

export type BookAuthor = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
};
