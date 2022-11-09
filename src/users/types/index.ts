import { UpdateUserDto } from '../dto';

export type UpdateUserOptions = {
  userId: number;
  updateUserDto: UpdateUserDto;
};

export type DeleteUserOptions = {
  authorizedUserId: number;
  userId: number;
};
