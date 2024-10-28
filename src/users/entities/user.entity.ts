import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Profile } from '../../profiles/entities/profiles.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  email: string

  @Column()
  password: string

  @OneToOne(() => Profile, (profile)=> profile.user, { cascade: true})
  profile: Profile

  // @OneToOne(() => Contacts, (contacts) => contacts.user, { onDelete: 'CASCADE'})
  // contacts: Contacts
  //
  // @OneToMany(() => Post, (post) => post.user, {onDelete: 'CASCADE', nullable: true})
  // posts: Post[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
