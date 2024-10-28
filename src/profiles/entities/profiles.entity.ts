import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn, ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Posts } from '../../posts/entities/post.entity';
import { Contacts } from './contacts.entity';
import { Friends } from '../../friends/entities/friend.entity';

@Entity('profiles')
export class Profile {
  @PrimaryColumn()
  id: number

  @Column({nullable: true})
  status: string

  @Column({nullable: true})
  photo: string

  @Column({nullable: true})
  full_name: string

  @Column({nullable: true})
  birthday: Date

  @Column({nullable: true})
  city: string

  @Column({nullable: true})
  place_of_work: string

  @Column({nullable: true})
  about_me: string

  @OneToOne(() => User, (user) => user.profile, {onDelete: 'CASCADE'})
  @JoinColumn({ name: 'user_id'})
  user: User

  @OneToOne(() => Contacts, (contacts) => contacts.profile, {cascade: true})
  contacts: Contacts

  @OneToMany(() => Friends, (friends) => friends.profile, {cascade: true})
  friends: Friends[]

  @OneToMany(() => Posts, (posts) => posts.profile, {nullable: true, cascade: true})
  posts: Posts[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updated: Date

}
