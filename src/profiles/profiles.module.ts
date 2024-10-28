import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entities/profiles.entity';
import { Contacts } from './entities/contacts.entity';
import { FriendsModule } from '../friends/friends.module';

@Module({
  imports: [TypeOrmModule.forFeature([Profile, Contacts]), FriendsModule],
  controllers: [ProfilesController],
  providers: [ProfilesService],
  exports: [ProfilesService]
})
export class ProfilesModule {}
