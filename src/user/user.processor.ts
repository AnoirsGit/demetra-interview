import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { UserService } from './user.service';

@Processor('userQueue')
export class UserProcessor {
  constructor(private readonly userService: UserService) {}

  @Process('updateUserStatus')
  async updateUserStatus(job: Job<{ userId: number }>) {
    const { userId } = job.data;
    const user = await this.userService.findById(userId);
    if (user) {
      user.status = true;
      await this.userService.userRepository.save(user);
    }
  }
}
