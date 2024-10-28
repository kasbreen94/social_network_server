import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsGateway } from './friends.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friends } from './entities/friend.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Friends])],
  providers: [FriendsGateway, FriendsService],
  exports: [FriendsService]
})
export class FriendsModule {}
