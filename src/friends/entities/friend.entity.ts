import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Profile } from '../../profiles/entities/profiles.entity';


@Entity('friends')
export class Friends {

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  friend_id: number

  @ManyToOne(() => Profile, (profile) => profile.friends, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'profile_id'})
  profile: Profile

}
