import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { LoginDto, LoginResponseDto } from './dto';

@Injectable()
export class AuthService {
  public constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  public async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.validateUser(loginDto);

    const payload = {
      userId: user.id,
      userRole: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  public async deactivateUser(userId: number) {
    return this.usersService.dectivateUser(userId);
  }

  private async validateUser(loginDto: LoginDto): Promise<User> {
    const { email, password } = loginDto;

    const user = await this.usersService.findByEmail(email);

    if (!(await user?.validatePassword(password)) || !user.isActive) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
