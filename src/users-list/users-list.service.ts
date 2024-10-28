import { Injectable } from '@nestjs/common';
import { ProfilesService } from '../profiles/profiles.service';

export interface UserI {
  id: string
  name: string
  photo: string
  status: string
  followed: boolean
}

@Injectable()
export class UsersListService {
  constructor(
    private readonly profilesService: ProfilesService
  ) {}
  private currentPage = 1
  private users: UserI[] = []

  setFilteredUsers() {

  }

  setCurrentPage(page) {
    return this.currentPage = page
  }

  // setUsers(term: string, count: number = 10, page: number = 1) {
  //   const currentPage = page
  //   const minSlice = (currentPage - 1) * count
  //   const maxSlice = (currentPage - 1) * count + count
  //
  //   const users = []
  //   const profiles = this.profilesService.setUsersList()
  //   profiles.slice(minSlice, maxSlice).map(profile => {
  //     const user: UserI = {
  //       id: profile.id,
  //       name: profile.name,
  //       photo: profile.photo,
  //       status: profile.status,
  //       followed: false
  //     }
  //     users.push(user)
  //   })
  //   this.users = users
  //
  //   if(term) {
  //     this.users = this.users.filter(
  //       user =>
  //         user.name.toLowerCase().includes(term.toLowerCase())
  //     )
  //   }
  // }

  async getUsers(authId: number, term: string) {
    return await this.profilesService.findUsers(authId, term)

  }
}
