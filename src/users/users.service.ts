import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserResponseDto, UpdateUserDto, CreateUserDto } from './dto';
import { UserRole } from './enum';

@Injectable()
export class UsersService {
  public constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getUsers(): Promise<User[]> {
    return await this.usersRepository.find({
      relations: ['books'],
    });
  }

  public async getUser(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      relations: ['books'],
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('A User with that id does not exist.');
    }

    return user;
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      const user = this.usersRepository.create(createUserDto);

      return await this.usersRepository.save(user);
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

  public async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({
      email,
    });

    if (!user) {
      throw new NotFoundException('A User with that email does not exist.');
    }

    return user;
  }

  public mapUserToUserResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      books: user.books
        ? user.books.map((book) => ({
            id: book.id,
            title: book.title,
            isbn: book.isbn,
            publishedDate: book.publishedDate,
            publisher: book.publisher,
          }))
        : [],
    };
  }
}
