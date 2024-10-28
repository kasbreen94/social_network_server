import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Profile } from './profiles.entity';
import { User } from '../../users/entities/user.entity';

@Entity('contacts')
export class Contacts {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({nullable: true})
  phone_number: string

  @Column({nullable: true})
  my_website: string

  @Column({nullable: true})
  vk: string

  @Column({nullable: true})
  github: string

  @OneToOne(() => Profile, (profile) => profile.contacts, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'profile_id'})
  profile: Profile

  // @OneToOne(() => User, (user) => user.contacts)
  // user: User
}