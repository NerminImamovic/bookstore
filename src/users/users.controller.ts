import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Put,
  Delete,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto';
import RoleGuard from './guards/RoleGuard';
import { UserRole } from './enum';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }

  @Get(':id')
  show(@Param('id') id: number) {
    return this.usersService.getUser(id);
  }

  // @UseGuards(RoleGuard(UserRole.ADMIN))
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth('Authroization')
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @UseGuards(RoleGuard(UserRole.ADMIN))
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authroization')
  @Put(':id/update')
  updateBook(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @UseGuards(RoleGuard(UserRole.ADMIN))
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authroization')
  @Delete(':id/delete')
  async delete(@Param('id') id: number): Promise<any> {
    return this.usersService.deleteUser(id);
  }
}
