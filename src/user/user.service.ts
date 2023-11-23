import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { AuthUserDto } from './user.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    public readonly userRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async createUser(authUserDto: AuthUserDto): Promise<User> {
    const { email, password } = authUserDto;
    const existingUser = await this.findByEmail(email);

    if (existingUser) {
      throw new BadRequestException('ERR_USER_EMAIL_EXISTS');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User();
    newUser.email = email;
    newUser.password = hashedPassword;

    return this.userRepository.save(newUser);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | undefined> {
    const cachedUserString = await this.cacheManager.get<string>(`user_${id}`);

    if (cachedUserString) return JSON.parse(cachedUserString) as User;

    const foundUser = await this.userRepository.findOne({ where: { id } });
    if (foundUser) {
      await this.cacheManager.set(
        `user_${id}`,
        JSON.stringify(foundUser),
        30 * 60 * 1000,
      );
      return foundUser;
    }

    throw new BadRequestException('ERR_USER_NOT_FOUND');
  }
}
