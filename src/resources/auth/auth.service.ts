import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';
import { JwtService } from '@nestjs/jwt';
import * as process from 'node:process';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwt: JwtService,
  ) {}

  async validateUser(createUserDto: CreateUserDto): Promise<any> {
    const user = await this.userService.findOneByLogin(createUserDto.login);
    if (!user) return null;
    const isValidPassword = await bcrypt.compare(
      createUserDto.password,
      user.password,
    );
    if (isValidPassword) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async signup(createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  async login(body: any) {
    const user = await this.userService.findOneByLogin(body.login);
    const payload = { login: user.login, userId: user.id };
    const accessToken = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_SECRET_KEY || 'secret',
      expiresIn: process.env.TOKEN_EXPIRE_TIME || '1h',
    });
    const refreshToken = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_SECRET_REFRESH_KEY || 'secret',
      expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME || '24h',
    });
    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    if (!refreshToken)
      throw new UnauthorizedException('No refresh token in body');

    try {
      const { userId, login } = this.jwt.verify(refreshToken, {
        secret: process.env.JWT_SECRET_REFRESH_KEY || 'secret',
      });
      return await this.login({ login, id: userId });
    } catch {
      throw new ForbiddenException('Refresh token is outdated or invalid');
    }
  }
}
