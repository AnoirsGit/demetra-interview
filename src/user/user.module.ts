import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { BullModule } from '@nestjs/bull';
import { UserProcessor } from './user.processor';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    JwtModule,
    CacheModule.register(),
    TypeOrmModule.forFeature([User]),
    BullModule.registerQueue({ name: 'userQueue' }),
  ],
  controllers: [UserController],
  providers: [UserService, AuthService, UserProcessor],
})
export class UserModule {}
