import { Body, Controller, Delete, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findOne() {
    // return this.usersService.findAll();
  }

  @Delete(':user_id')
  remove(@Param('user_id') userId: number) {
    return this.usersService.remove(userId)
  }

}
