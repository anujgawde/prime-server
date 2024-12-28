import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { IUser } from './interfaces/user.interface';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('')
  getUsers(): Promise<IUser[]> {
    return this.userService.getUsers();
  }

  @Get('/:userId')
  getUserById(@Param('userId') userId: string): Promise<IUser> {
    return this.userService.getUserById(userId);
  }

  @Post('/create-user')
  createUser(@Body() createUserDto: CreateUserDto): Promise<IUser> {
    return this.userService.createUser(createUserDto);
  }

  @Post('/document-aggregate-statistics')
  getUserDocsAggregate(@Body() userDocsAggregateDto) {
    return this.userService.getUserDocsAggregate(userDocsAggregateDto);
  }

  @Post('/update-profile')
  updateUserProfile(
    @Body() updateUserProfileDto: UpdateProfileDto,
  ): Promise<IUser> {
    return this.userService.updateUserProfile(updateUserProfileDto);
  }
}
