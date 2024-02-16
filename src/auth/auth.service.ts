import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { TokenBlacklistService } from './token-blacklist.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private tokenBlacklistService: TokenBlacklistService,
  ) {}

  async register(
    createUserDto: CreateUserDto,
  ): Promise<{ access_token: string }> {
    const existingUser = await this.userService.findByUsername(
      createUserDto.username,
    );

    if (existingUser) {
      throw new ConflictException('Username is already taken');
    }
    const newUser = await this.userService.create(createUserDto);
    const payload = { username: newUser.username, sub: newUser.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async login(user: any): Promise<{ access_token: string }> {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async logout(token: string): Promise<void> {
    await this.tokenBlacklistService.blacklistToken(token);
  }
}
