import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { Book } from './book.entity';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [UsersModule, AuthModule, TypeOrmModule.forFeature([User, Book])],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
