import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UnauthorizedException,
  BadRequestException,
  Get,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, LoginUserDto } from './user.dto';
import { User } from './user.entity';
import { AuthService } from './auth.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  @UsePipes(new ValidationPipe())
  async signUp(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ message: string }> {
    const { email, password } = createUserDto;
    const existingUser = await this.userService.findByEmail(email);

    if (existingUser) throw new BadRequestException('ERR_USER_EMAIL_EXISTS');

    const newUser = new User();
    newUser.email = email;
    newUser.password = password;

    await this.userService.createUser(newUser);

    return { message: 'User registered successfully' };
  }

  @Post('signin')
  @UsePipes(new ValidationPipe())
  async signIn(@Body() loginUserDto: LoginUserDto): Promise<{ token: string }> {
    const { email, password } = loginUserDto;

    const user = await this.userService.findByEmail(email);

    if (!user || !(await this.authService.validateUser(user, password))) {
      throw new UnauthorizedException('INVALID_CREDENTIALS');
    }

    const token = await this.authService.generateToken(user.id, user.email);
    return { token };
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
