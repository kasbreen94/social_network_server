import { IsEmpty } from 'class-validator';

export class CreateFriendDto {

  @IsEmpty()
  friend_id: number

}
