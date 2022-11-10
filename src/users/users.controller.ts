import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Put,
  Delete,
  HttpCode,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateUserDto, UserResponseDto, CreateUserDto } from './dto';
import RoleGuard from '../auth/guards/RoleGuard';
import { UserRole } from './enum';
import { CreateResponseDto } from '../utils/createResponse';

@Controller('users')
@ApiTags('users')
export class UsersController {
  public constructor(private readonly usersService: UsersService) {}

  @HttpCode(200)
  @Get()
  public async getUsers(): Promise<UserResponseDto[]> {
    const users = await this.usersService.getUsers();

    return users.map((user) => this.usersService.mapUserToUserResponse(user));
  }

  @HttpCode(200)
  @ApiParam({
    name: 'id',
    required: true,
    description: 'User Id',
    type: Number,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
  })
  @Get(':id')
  public async getUser(@Param('id') id: number): Promise<UserResponseDto> {
    const user = await this.usersService.getUser(id);

    return this.usersService.mapUserToUserResponse(user);
  }

  @HttpCode(201)
  @ApiBody({
    type: CreateUserDto,
    required: true,
    description: 'User Params',
  })
  @ApiResponse({
    status: 201,
    description: 'Created',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthroized',
  })
  @UseGuards(RoleGuard(UserRole.ADMIN))
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authroization')
  @Post()
  public async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CreateResponseDto> {
    const user = await this.usersService.createUser(createUserDto);

    return { id: user.id };
  }

  @HttpCode(204)
  @ApiParam({
    name: 'id',
    required: true,
    description: 'User Id',
    type: Number,
  })
  @ApiBody({
    type: UpdateUserDto,
    required: true,
    description: 'Update User Transfer Object',
  })
  @ApiResponse({
    status: 204,
    description: 'No Content',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
  })
  @UseGuards(RoleGuard(UserRole.ADMIN))
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authroization')
  @Put(':id/update')
  public async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<void> {
    await this.usersService.updateUser(id, updateUserDto);
  }

  @HttpCode(204)
  @ApiParam({
    name: 'id',
    required: true,
    description: 'User Id',
    type: Number,
  })
  @ApiResponse({
    status: 204,
    description: 'No Content',
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
  @UseGuards(RoleGuard(UserRole.ADMIN))
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authroization')
  @Delete(':id/delete')
  public async deleteUser(@Param('id') id: number): Promise<void> {
    await this.usersService.deleteUser(id);
  }
}
