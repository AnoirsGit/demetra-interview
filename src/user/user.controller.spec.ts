// src/user/user.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';
import { AuthUserDto } from './user.dto';
import { AuthService } from './auth.service';
import { BadRequestException } from '@nestjs/common';

const mockUserService = {
  findByEmail: jest.fn(),
  createUser: jest.fn(),
};

const mockAuthService = {
  validateUser: jest.fn(),
  generateToken: jest.fn(),
};

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: getRepositoryToken(User),
          useClass: jest.fn(),
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('should throw BadRequestException when email already exists', async () => {
      const mockAuthUserDto: AuthUserDto = {
        email: 'existing@example.com',
        password: 'password',
      };

      mockUserService.findByEmail.mockReturnValue(Promise.resolve(new User()));

      await expect(controller.signUp(mockAuthUserDto)).rejects.toThrowError(
        BadRequestException,
      );
      expect(mockUserService.createUser).not.toHaveBeenCalled();
    });

    it('should successfully register a user', async () => {
      const mockAuthUserDto: AuthUserDto = {
        email: 'new@example.com',
        password: 'password',
      };

      mockUserService.findByEmail.mockReturnValue(Promise.resolve(undefined));

      const mockUser = new User();
      mockUserService.createUser.mockReturnValue(Promise.resolve(mockUser));

      await expect(controller.signUp(mockAuthUserDto)).resolves.toEqual({
        message: 'User registered successfully',
      });
      expect(mockUserService.createUser).toHaveBeenCalledWith(expect.any(User));
    });
  });
});
