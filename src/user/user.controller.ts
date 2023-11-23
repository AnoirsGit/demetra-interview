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
import * as bcrypt from 'bcrypt';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  @UsePipes(new ValidationPipe())
  async signUp(@Body() AuthUserDto: AuthUserDto): Promise<{ message: string }> {
    const { email, password } = AuthUserDto;
    const existingUser = await this.userService.findByEmail(email);

    if (existingUser) throw new BadRequestException('ERR_USER_EMAIL_EXISTS');

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the hashed password
    const newUser = new User();
    newUser.email = email;
    newUser.password = hashedPassword;

    // Save the user to the database
    await this.userService.createUser(newUser);
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
