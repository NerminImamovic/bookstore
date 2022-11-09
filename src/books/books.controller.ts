import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Book } from './book.entity';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('books')
@ApiTags('books')
export class BooksController {
  constructor(private booksService: BooksService) {}

  @ApiResponse({
    status: 200,
    description: 'A post has been successfully fetched',
    type: Array<Book>,
  })
  @Get()
  public getBooks() {
    return this.booksService.getAllBooks();
  }

  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a book that exists in the database',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'A book has been successfully fetched',
    type: Book,
  })
  @ApiResponse({
    status: 404,
    description: 'A book with that id does not exist.',
  })
  @Get(':id')
  getBook(@Param('id') id: number) {
    return this.booksService.getBook(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authroization')
  @Post()
  createBook(@Req() req: any, @Body() createBookDto: CreateBookDto) {
    return this.booksService.createBook({
      authorizedUserId: req.user.userId,
      createBookDto,
    });
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authroization')
  @Put(':id/update')
  updateBook(
    @Req() req: any,
    @Body() updateBookDto: UpdateBookDto,
    @Param('id') id: number,
  ) {
    return this.booksService.updateBook({
      authorizedUserId: req.user.userId,
      bookId: id,
      updateBookDto,
    });
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authroization')
  @Delete(':id/delete')
  async delete(@Req() req: any, @Param('id') id: number): Promise<any> {
    return this.booksService.deleteBook({
      authorizedUserId: req.user.userId,
      bookId: id,
    });
  }
}
