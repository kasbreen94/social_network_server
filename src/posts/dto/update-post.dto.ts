import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import { IsEmpty, IsNotEmpty } from 'class-validator';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @IsEmpty()
  message: string

  updatedAt: Date
}
