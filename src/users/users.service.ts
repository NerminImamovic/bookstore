import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserResponseDto } from './dto/user-response.dto';
import { UserRole } from './enum';
import { UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getUsers(): Promise<UserResponseDto[]> {
    const users = await this.usersRepository.find();

    return users.map((user) => this.mapUserToUserResponse(user));
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      const user = this.usersRepository.create(createUserDto);
      await this.usersRepository.save(user);

      return {
        id: user.id,
      };
    } catch (err) {
      if (err?.message.startsWith('Duplicate entry')) {
        throw new BadRequestException('User with that email already exsists!');
      }

      throw err;
    }
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<boolean> {
    const userToBeUpdated = await this.getUser(id);

    const updatedUser = { ...userToBeUpdated, updateUserDto };

    await this.usersRepository.save(updatedUser);

    return true;
  }

  public async dectivateUser(userId: number): Promise<boolean> {
    try {
      const user = await this.getUser(userId);
      user.isActive = false;

      await this.usersRepository.save(user);

      return true;
    } catch (error) {
      throw error;
    }
  }

  public async deleteUser(id: number): Promise<boolean> {
    try {
      const user = await this.getUser(id);

      if (user.role === UserRole.ADMIN && user.isActive) {
        throw new ForbiddenException(
          'It is not possible to delete acitve admin users.',
        );
      }

      await this.usersRepository.delete({ id });

      return true;
    } catch (error) {
      throw error;
    }
  }

  public async getUser(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('A User with that id does not exist.');
    }

    return user;
  }

  public async findByEmail(email: string) {
    const user = this.usersRepository.findOneBy({
      email,
    });

    if (!user) {
      throw new NotFoundException('A User with that email does not exist.');
    }

    return user;
  }

  private mapUserToUserResponse(user: User): UserResponseDto {
    return user as UserResponseDto;
  }
}
