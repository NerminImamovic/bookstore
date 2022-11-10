import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateResponseDto } from '../utils/createResponse';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BooksService } from './books.service';
import { BookResponseDto, CreateBookDto, UpdateBookDto } from './dto';

@Controller('books')
@ApiTags('books')
export class BooksController {
  public constructor(private booksService: BooksService) {}

  @Get()
  public async getBooks(): Promise<BookResponseDto[]> {
    const books = await this.booksService.getBooks();
    return books.map((book) => this.booksService.mapBookToBookResponse(book));
  }

  @ApiParam({
    name: 'id',
    required: true,
    description: 'Book Id',
    type: Number,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
  })
  @Get(':id')
  public async getBook(@Param('id') id: number): Promise<BookResponseDto> {
    const book = await this.booksService.getBook(id);

    return this.booksService.mapBookToBookResponse(book);
  }

  @HttpCode(201)
  @ApiBody({
    type: CreateBookDto,
    required: true,
    description: 'Book Params',
  })
  @ApiResponse({
    status: 201,
    description: 'Created',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthroized',
  })
  @ApiResponse({
    status: 403,
    description: 'Fodbidden',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authroization')
  @Post()
  public async createBook(
    @Req() req: any,
    @Body() createBookDto: CreateBookDto,
  ): Promise<CreateResponseDto> {
    const book = await this.booksService.createBook({
      authorizedUserId: req.user.userId,
      createBookDto,
    });

    return { id: book.id };
  }

  @HttpCode(204)
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Book Id',
    type: Number,
  })
  @ApiBody({
    type: UpdateBookDto,
    required: true,
    description: 'Update Book Transfer Object',
  })
  @ApiResponse({
    status: 204,
    description: 'No content',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthroized',
  })
  @ApiResponse({
    status: 403,
    description: 'Fodbidden',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authroization')
  @Put(':id/update')
  public async updateBook(
    @Req() req: any,
    @Body() updateBookDto: UpdateBookDto,
    @Param('id') id: number,
  ): Promise<void> {
    await this.booksService.updateBook({
      authorizedUserId: req.user.userId,
      bookId: id,
      updateBookDto,
    });
  }

  @HttpCode(204)
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Book Id',
    type: Number,
  })
  @ApiResponse({
    status: 204,
    description: 'No content',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthroized',
  })
  @ApiResponse({
    status: 403,
    description: 'Fodbidden',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authroization')
  @Delete(':id/delete')
  public async delete(@Req() req: any, @Param('id') id: number): Promise<void> {
    await this.booksService.deleteBook({
      authorizedUserId: req.user.userId,
      bookId: id,
    });
  }
}
