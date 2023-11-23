import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    public readonly userRepository: Repository<User>,
    @InjectQueue('userQueue')
    private readonly userQueue: Queue,
  ) {}

  async createUser(user: User): Promise<User> {
    const createdUser = await this.userRepository.save(user);

    await this.userQueue.add(
      'updateUserStatus',
      { userId: createdUser.id },
      { delay: 10000 },
    );
    return createdUser;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id } });
  }
}
