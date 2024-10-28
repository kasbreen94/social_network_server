import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { ProfilesModule } from '../profiles/profiles.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from './entities/post.entity';
import { Profile } from '../profiles/entities/profiles.entity';
import { Likes } from './entities/likes.entity';
import { PostsGateway } from './gateway/posts.gateway';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    ProfilesModule,
    UsersModule,
    JwtModule,
    TypeOrmModule.forFeature([Posts, Likes])],
  controllers: [PostsController],
  providers: [PostsService, PostsGateway],
})
export class PostsModule {}
