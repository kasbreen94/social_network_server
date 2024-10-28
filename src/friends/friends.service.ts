import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFriendDto } from './dto/create-friend.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Friends } from './entities/friend.entity';
import { FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class FriendsService {

  constructor(
    @InjectRepository(Friends) private readonly friendsRepository: Repository<Friends>,
  ) {
  }

  async friendStatus(authId, userId) {
    const friend = await this.friendsRepository.findOne({
      where: {
        friend_id: userId,
        profile: { id: authId },
      } as FindOptionsWhere<Friends>,
    });

    const friendUser = await this.friendsRepository.findOne({
      where: {
        friend_id: authId,
        profile: { id: userId },
      } as FindOptionsWhere<Friends>,
    });

    let stateFiendForTargetUser;
    let stateFriendForAuthUser;

    if (friend && !friendUser) {
      stateFiendForTargetUser = false
      stateFriendForAuthUser = 'subscriber'
    }
    if (friendUser && !friend) {
      stateFiendForTargetUser = 'subscriber'
      stateFriendForAuthUser = false
    }
    if (friend && friendUser) {
      stateFiendForTargetUser = true
      stateFriendForAuthUser = true
    }
    if (!friend && !friendUser) {
      stateFiendForTargetUser = false
      stateFriendForAuthUser = false
    }

    return {
      dataForTargetUser: { id: authId, isFriend: stateFiendForTargetUser },
      dataForAuthUser: { id: userId, isFriend: stateFriendForAuthUser },
    };
  }

  async create(authId: number, createFriendDto: CreateFriendDto) {
    const isFriend = await this.friendsRepository.findOne({
      where: {
        friend_id: createFriendDto.friend_id,
        profile: { id: authId },
      } as FindOptionsWhere<Friends>,
    });

    if (isFriend) throw new BadRequestException('This is users your friend');
    console.log(createFriendDto, authId);

    await this.friendsRepository.save({
      friend_id: createFriendDto.friend_id,
      profile: { id: authId },
    });

    return this.friendStatus(authId, createFriendDto.friend_id);
  }

  async remove(authId: number, userId: number) {
    await this.friendsRepository.delete({ friend_id: userId, profile: authId } as FindOptionsWhere<Friends>);
    return this.friendStatus(authId, userId);
  }

}
