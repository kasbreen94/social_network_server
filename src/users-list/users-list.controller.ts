import { Body, Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { UsersListService } from './users-list.service';
import { QueryUsersListDto } from './dto/query-users-list.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersListController {
  constructor(private readonly usersListService: UsersListService) {}

  @Get('')
  @UseGuards(JwtAuthGuard)
  async getUsers(@Req() req, @Query() query: {term: string}) {
    // await this.usersListService.setUsers(query.name, query.count, query.page)
    const authId = req.user.id
    return this.usersListService.getUsers(authId, query.term);
  }
}
