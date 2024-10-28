import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { IUser } from '../types/types';

// interface registeredUsersI {
//   [userId: string]: {
//     userId: string
//     login: string
//     email: string
//     password: string
//   }
// }

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService
  ) {  }

  // logIn(email: string, password: string) {
  //   let authId;
  //   Object.values(this.registeredUsers).find(user => {
  //     if(user.email.toLowerCase().trim() === email.toLowerCase().trim() && user.password === password) {
  //       authId = user.userId
  //     }
  //   })
  //   return authId
  // }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOne(email);
    const passwordIsMatch = await argon2.verify(user.password, password)
    if(user && passwordIsMatch) {
      const { password, ...result} = user;
      return result
    }
    throw new UnauthorizedException('Email or password are incorrect.')
  }

  async login(user: IUser) {
   const {id, email} = user;
   return {
     id,
     email,
     token: this.jwtService.sign({id: user.id, email: user.email})
   }
  }

}
