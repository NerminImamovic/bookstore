import { IsEmail, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  email?: string;

  @IsString()
  firstName?: string;

  @IsString()
  password?: string;

  @IsString()
  lastName?: string;
}
