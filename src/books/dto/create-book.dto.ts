import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  isbn: string;

  @IsNotEmpty()
  @IsDate()
  publishedDate: Date;

  @IsNotEmpty()
  @IsString()
  publisher: string;

  @IsNumber()
  authorId: number;
}
