import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne, OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Profile } from '../../profiles/entities/profiles.entity';
import { User } from '../../users/entities/user.entity';
import { Likes } from './likes.entity';

@Entity('posts')
export class Posts {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  message: string

  @Column()
  sender_id: number

  @Column()
  sender_name: string

  @Column()
  sender_photo: string

  // @ManyToOne(() => User, (user) => user.posts)
  // // @JoinColumn({name: 'user_id'})
  // user: User

  @ManyToOne(() => Profile, (profile) => profile.posts, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'profile_id'})
  profile: Profile

  @OneToMany(() => Likes, (likes) => likes.post, {cascade: true})
  likes: Likes[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn({nullable: true})
  updatedAt: Date
}
