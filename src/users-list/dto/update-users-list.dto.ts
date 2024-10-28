import { PartialType } from '@nestjs/mapped-types';
import { QueryUsersListDto } from './query-users-list.dto';

export class UpdateUsersListDto extends PartialType(QueryUsersListDto) {}
