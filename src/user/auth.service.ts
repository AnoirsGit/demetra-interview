import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from './user.service';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(user: User, password: string): Promise<boolean> {
    return await bcrypt.compare(password, user.password);
  }

  async generateToken(userId: number, email: string): Promise<string> {
    const payload = { sub: userId, email };
    return this.jwtService.sign(payload);
  }

  async validateUserByEmail(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);

    if (!user || !(await this.validateUser(user, password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
