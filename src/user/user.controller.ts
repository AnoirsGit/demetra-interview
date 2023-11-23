// Import the UserService at the top of your UserController
import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  BadRequestException,
  Get,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthUserDto } from './user.dto';
import { User } from './user.entity';
import { AuthService } from './auth.service';

// ...

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  @UsePipes(new ValidationPipe())
  async signUp(@Body() authUserDto: AuthUserDto): Promise<{ message: string }> {
    await this.userService.createUser(authUserDto);
    return { message: 'User registered successfully' };
  }

  @Post('signin')
  @UsePipes(new ValidationPipe())
  async signIn(@Body() signInDto: AuthUserDto): Promise<{ token: string }> {
    const { email, password } = signInDto;

    try {
      const result = await this.authService.signIn(email, password);
      return result;
    } catch (error) {
      throw new BadRequestException('INVALID_CREDENTIALS');
    }
  }

  @Get('get-user-by-id/:id')
  async getUserById(@Param('id') id: string): Promise<User> {
    const userId = parseInt(id, 10);

    if (isNaN(userId)) throw new BadRequestException('INVALID_USER_ID');

    const user = await this.userService.findById(userId);

    if (!user) throw new BadRequestException('ERR_USER_NOT_FOUND');

    const { ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
