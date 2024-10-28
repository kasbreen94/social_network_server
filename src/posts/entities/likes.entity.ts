import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Posts } from './post.entity';

@Entity()
export class Likes {

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  sender_id: number

  @Column()
  sender_name: string

  @Column()
  sender_photo: string

  @ManyToOne(() => Posts, (posts) => posts.likes, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'post_id'})
  post: Posts
}