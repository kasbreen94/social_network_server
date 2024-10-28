import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { Posts } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Likes } from './entities/likes.entity';
import { ProfilesService } from '../profiles/profiles.service';
import { Profile } from '../profiles/entities/profiles.entity';

export interface ILike {
  id: string;
  senderId: string;
  senderName: string;
  senderPhoto: string;
}

export interface IPost {
  id: string
  message: string;
  senderName: string;
  senderId: string;
  senderPhoto: string;
  likes: ILike[]
}

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts) private readonly postsRepository: Repository<Posts>,
    @InjectRepository(Likes) private readonly likesRepository: Repository<Likes>,
    @Inject()
    private readonly profilesService: ProfilesService
  ) {}

  private count = 0

  async findPost(id: string) {
    return await this.postsRepository.findOne({
      where:{
        id
      } as FindOptionsWhere<Posts>,
      relations: {
        likes: true,
        profile: true
      } as FindOptionsRelations<Posts>
    })
  }

  async findTotalPosts(id) {
    const posts = await this.postsRepository.find({
      where: {
        profile: {id}
      } as FindOptionsWhere<Posts>
    })
    return posts.length
  }



  async findAll(userId: number, page: number) {
    if (page === 1) this.count = 0

    const totalPosts = await this.findTotalPosts(userId)
    const posts = await this.postsRepository.find({
      where: {
        profile: {id: userId}
      } as FindOptionsWhere<Posts>,
      relations: {
        likes: true
      },
      order: {
        createdAt: 'DESC'
      },
      take: 5,
      skip: ((page - 1) * 5) - this.count
    })

    if (!posts) throw new NotFoundException('Posts not found')



    return {posts: posts, totalPosts: totalPosts, totalPages: Math.ceil(totalPosts/5) }
  }

  async create(authId: number, createPostDto: CreatePostDto) {
    const profile = await this.profilesService.findProfile(authId, authId);

    const {message, recipientId} = createPostDto;
    if(!message) throw new BadRequestException('The published message is not defined');
    if(!recipientId) throw new BadRequestException('The recipient`s ID is not defined');
    const newPost = await this.postsRepository.save({
      message: message,
      sender_id: profile.id,
      sender_name: profile.full_name,
      sender_photo: profile.photo,
      profile: recipientId,
      likes: [],
      updatedAt: null
    });

    const totalPosts = await this.findTotalPosts(recipientId)

    this.count = this.count - 1

    console.log(this.count)

    return {newPost: newPost, totalPosts: totalPosts, totalPages: totalPosts/5}
  };

  async update(authId: number, postId: string, updatePostDto: UpdatePostDto){
    const post = await this.findPost(postId);

    console.log(updatePostDto)

    if(!post) throw new NotFoundException('Post not found')
    if(post.sender_id !== authId) throw new BadRequestException('You cannot edit this message')

    await this.postsRepository.update(postId, updatePostDto)

    return await this.findPost(postId)
  }

  async delete(authId: number, postId: string, recipientId: number) {
    const post = await this.findPost(postId)

    if (!post) throw new NotFoundException('Post not found');
    if (post.sender_id !== authId && recipientId !== authId) throw new BadRequestException('You cannot delete this post');

    await this.postsRepository.delete(postId)

    const totalPosts = await this.findTotalPosts(recipientId)

    this.count = this.count + 1

    console.log(this.count)

    return {post, totalPosts}
  }

  async createLike(authId: number, postId: string, recipientId: number) {
    const like = await this.likesRepository.findOne({
      where: {
        sender_id: authId,
        post: { id: postId },
      } as FindOptionsWhere<Likes>
    });

    if(like) throw new BadRequestException('This item already exist')

    const profile = await this.profilesService.findProfile(authId,authId);

    if (!profile) throw new BadRequestException('Profile not found')

    const post = await this.findPost(postId)

    if(!post) throw new BadRequestException('Post not found')

    const newLike = await this.likesRepository.save({
      sender_id: profile.id,
      sender_name: profile.full_name,
      sender_photo: profile.photo,
      post: {id: postId}
    })

    return  {newLike, profile: recipientId}
  }

  async deleteLike(authId: number, postId: string) {
    const likeFind = await this.likesRepository.findOne({
      where: {
        sender_id: authId,
        post: { id: postId },
      } as FindOptionsWhere<Likes>,
      relations: {
        post: true
      } as FindOptionsRelations<Likes>
    })

    if(!likeFind) throw new NotFoundException('This item not found');

    await this.likesRepository.delete(
      {
        sender_id: authId,
        post: {id: postId}
      } as FindOptionsWhere<Likes>);



    return { like: likeFind }
  }
}


