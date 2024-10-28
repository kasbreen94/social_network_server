import { Inject, Injectable, NotFoundException } from '@nestjs/common';
// import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entities/profiles.entity';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { Contacts } from './entities/contacts.entity';
import { FriendsService } from '../friends/friends.service';

export interface ContactsI {
  id: string;
  title: string;
  description: string;
}

export interface ProfileI {
  id: string;
  name: string;
  status: string;
  lookingForAJob: boolean;
  lookingForAJobDescription: string;
  aboutMe: string;
  photo: string;
  contacts: ContactsI[];
}

export interface ProfilesI {
  [userId: string]: ProfileI;
}

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile) private readonly profileRepository: Repository<Profile>,
    @InjectRepository(Contacts) private readonly contactsRepository: Repository<Contacts>,
    @Inject()
    private readonly friendsService: FriendsService
  ) {
  }

  async findUsers(authId: number, term: string) {
    const profiles = await this.profileRepository.find({
      order: {
        id: 'DESC',
      },
    });

    let users = await Promise.all(profiles.map(async profile => {

      const isFriend = await this.friendsService.friendStatus(authId, profile.id)

      return {
        id: profile.id,
        full_name: profile.full_name,
        photo: profile.photo,
        birthday: profile.birthday,
        city: profile.city,
        place_of_work: profile.place_of_work,
        isFriend: isFriend.dataForAuthUser.isFriend
      };
    }))

    if(term) {
          users = users.filter(
            user =>
              user.full_name.toLowerCase().includes(term.toLowerCase())
          )
        }

    const totalUsers = users.length;
    return { users, totalUsers };
  }

  async create(id: number) {
    return await this.profileRepository.save({
      id: id,
      user: { id },
      contacts: {
        profile: { id },
      },
    });
  }

  async findAuthProfile(authId) {
     return await this.profileRepository.findOne({
       where: {
         id: authId
       },
       relations: {
         friends: true
       }
     })
  }

  async findProfile(authId: number, id: number) {
    const profile = await this.profileRepository.findOne({
      where: {
        user: { id },
      } as FindOptionsWhere<Profile>,
      relations: {
        contacts: true,
        friends: true
      } as FindOptionsRelations<Profile>,
    });

    if (!profile) throw new NotFoundException('Profile not found');

    const { phone_number, vk, my_website, github } = profile.contacts;

    const isFriend = await this.friendsService.friendStatus(authId, id)

    return {
      id: profile.id,
      status: profile.status,
      full_name: profile.full_name,
      photo: profile.photo,
      birthday: profile.birthday,
      city: profile.city,
      place_of_work: profile.place_of_work,
      about_me: profile.about_me,
      contacts: {
        phone_number,
        vk,
        my_website,
        github
      },
      isFriend: isFriend.dataForAuthUser.isFriend
    };

  }

  async getProfile(authId: number, id: number) {
    return await this.findProfile(authId, id);
  }

  async updateProfile(id: number, updateProfileDto: UpdateProfileDto) {
    const {contacts, ...profile} = updateProfileDto;
    await this.profileRepository.update(id, profile);
    await this.contactsRepository.update({profile: {id}} as FindOptionsWhere<Contacts>, contacts)

    return this.findProfile(id, id)
  }

}
