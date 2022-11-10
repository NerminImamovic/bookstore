import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginDto, LoginResponseDto } from './dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @ApiBody({
    type: LoginDto,
    required: true,
    description: 'User Params',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthroized',
  })
  @Post('login')
  public async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto);
  }

  @HttpCode(204)
  @ApiResponse({
    status: 401,
    description: 'Unauthroized',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authroization')
  @Delete('deactivate')
  public async deactivate(@Req() req: any): Promise<void> {
    await this.authService.deactivateUser(req.user.userId);
  }
}
