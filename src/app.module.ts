import { Module } from '@nestjs/common';
import { PostsModule } from './posts/posts.module';
import { ProfilesModule } from './profiles/profiles.module';
import { AuthModule } from './auth/auth.module';
import { UsersListModule } from './users-list/users-list.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { PostsGateway } from './posts/gateway/posts.gateway';
import { FriendsModule } from './friends/friends.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        synchronize: true,
        entities: [__dirname + '/**/*.entity{.js, .ts}'],
      }) as TypeOrmModuleOptions,
      inject: [ConfigService],
    }),
    PostsModule,
    ProfilesModule,
    AuthModule,
    UsersListModule,
    UsersModule,
    FriendsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
