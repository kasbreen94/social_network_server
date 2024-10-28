import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { ProfilesService } from '../profiles/profiles.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly profilesService: ProfilesService
  ) {}

 async create(createUserDto: CreateUserDto) {
    const existUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email
      }
    })
   if (existUser) throw new BadRequestException('This email already exist.');

   const user = await this.userRepository.save({
     email: createUserDto.email,
     password: await argon2.hash(createUserDto.password),
   })

   const profile = await this.profilesService.create(user.id)

   const token = this.jwtService.sign({id: user.id, email: user.email})

   return {user, token, profile};
  }

  async findOne(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email: email
      }
    });

    if(!user) throw new NotFoundException('User not found')

    return user
  }

  async remove(id: number) {
    const deleteUser = await this.userRepository.findOneBy({id})
    if(!deleteUser) throw new NotFoundException();
    await this.userRepository.delete(id)
  }

}
