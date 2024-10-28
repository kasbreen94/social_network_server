import { PartialType } from '@nestjs/mapped-types';
import { CreateProfileDto } from './create-profile.dto';
import { IsNotEmpty } from 'class-validator';
import { IContacts } from '../../types/types';
import { Column } from 'typeorm';

export class UpdateProfileDto extends PartialType(CreateProfileDto) {

  @IsNotEmpty()
  status: string

  @IsNotEmpty()
  full_name: string

  @IsNotEmpty()
  photo: string

  @IsNotEmpty()
  birthday: Date

  @IsNotEmpty()
  city: string

  @IsNotEmpty()
  place_of_work: string

  @IsNotEmpty()
  about_me: string

  @IsNotEmpty()
  contacts: IContacts
}
