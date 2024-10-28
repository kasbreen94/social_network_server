import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get(':userId?')
  @UseGuards(JwtAuthGuard)
  async getPosts(@Param('userId') userId: string, @Query('page') page: string) {

    return this.postsService.findAll(+userId, +page);
  };

  @Post('create_post')
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createPostDto: CreatePostDto,
    @Req() req
  ) {
    return this.postsService.create(req.user.id, createPostDto);
  };

  @Patch('/:postId/update_post')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('postId') postId: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req
  ) {
    return this.postsService.update(req.user.id, postId, updatePostDto)
  }

  @Delete(':postId&:userId/delete_post')
  @UseGuards(JwtAuthGuard)
  deletePost(
    @Param() id: {postId: string, userId: string},
    @Req() req
  ){

    return this.postsService.delete(req.user.id, id.postId , +id.userId)
  }

  @Post(':postId/like')
  @UseGuards(JwtAuthGuard)
  createLike(
    @Param('postId') postId: string,
    @Req() req
  ) {
    return
  }

  @Delete(':postId/dislike')
  @UseGuards(JwtAuthGuard)
  deleteLikePost(
    @Param('postId') postId: string,
    @Req() req
  ) {
    return this.postsService.deleteLike(req.user.id, postId)
  }
}
