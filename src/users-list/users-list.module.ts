import { Module } from '@nestjs/common';
import { UsersListService } from './users-list.service';
import { UsersListController } from './users-list.controller';
import { ProfilesModule } from '../profiles/profiles.module';

@Module({
  controllers: [UsersListController],
  providers: [UsersListService],
  imports: [ProfilesModule]
})
export class UsersListModule {}
