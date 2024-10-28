import { Profile } from '../../profiles/entities/profiles.entity';
import { IsEmpty, MinLength } from 'class-validator';

export class CreatePostDto {

  @IsEmpty()
  @MinLength(1)
  message: string

  @IsEmpty()
  recipientId: Profile

}
