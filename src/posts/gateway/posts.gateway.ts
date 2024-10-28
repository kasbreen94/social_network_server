import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { PostsService } from '../posts.service';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@WebSocketGateway({ cors: { origin: "*" }})
export class PostsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  constructor(
    private postsService: PostsService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) {}

  @WebSocketServer() server: Server

  async afterInit(server: Server) {
    // this.server.use(async (socket: Socket, next) => {
    //   const authUser = socket.handshake.auth
    //   const token = authUser.token;
    //
    //   if (!token) {
    //     await socket.disconnect()
    //     await this.server.disconnectSockets();
    //     return next(new Error("Invalid token"))
    //   }
    //
    //   next()
    // })
  }

  rooms = []
  async handleConnection(client: Socket) {
    this.server.use(async (socket: Socket, next) => {
      const authUser = socket.handshake.auth
      const token = authUser.token;

      if (!token) {
        await socket.disconnect()
        await this.server.disconnectSockets();
        return
      }

      console.log()

      const authUserData = await this.jwtService.decode(token)

      if(!authUserData) {
        await socket.disconnect()
        await this.server.disconnectSockets();
        return
      }

      const {email, id} = authUserData
      const user = await this.usersService.findOne(email)

      if (!user && !token) {
        await socket.disconnect()
        await this.server.disconnectSockets()
        return next(new Error("Invalid token"))
      }

      authUser.id = id
      next()
    })
  }


  async handleDisconnect(client: Socket) {
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() room: string) {
    client.join(room)
    client.emit('joinedRoom', room)

  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(@ConnectedSocket() client: Socket, @MessageBody() room: string) {
    client.leave(room)
    client.emit('leavedRoom', room)
  }

  @SubscribeMessage('createPost')
  async createPost(@ConnectedSocket() client: Socket, @MessageBody() payload: CreatePostDto): Promise<void> {
    const authId = client.handshake.auth.id
    const res = await this.postsService.create(authId, payload)
    this.server.to(`${payload.recipientId}`).emit(`resPost`, res)
  }

  @SubscribeMessage('updatePost')
  async updatePost(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: {
      postId: string,
      recipientId: number,
      message: string
    }): Promise<void> {
    console.log(payload)
    const authId = client.handshake.auth.id
    const {recipientId, postId, message} = payload
    const updatePostDto = {message: message} as UpdatePostDto
    const res = await this.postsService.update(authId, postId, updatePostDto)
    this.server.to(`${recipientId}`).emit(`updatePost`, res)

  }

  @SubscribeMessage('deletePost')
  async deletePost(@ConnectedSocket() client: Socket, @MessageBody() payload: {postId: string, recipientId: number}): Promise<void> {
    const authId = client.handshake.auth.id
    const res = await this.postsService.delete(authId, payload.postId, payload.recipientId)
    this.server.to(`${payload.recipientId}`).emit(`delPost`, res)
  }

  @SubscribeMessage('createLike')
  async createLike(@ConnectedSocket() client: Socket, @MessageBody() payload: { postId: string, recipientId: number }): Promise<void> {
    const authId = client.handshake.auth.id
    const res = await this.postsService.createLike(authId, payload.postId, payload.recipientId)
    this.server.to(`${payload.recipientId}`).emit(`resLike`, res)
  }

  @SubscribeMessage('deleteLike')
  async deleteLike(@ConnectedSocket() client: Socket, @MessageBody() payload: { postId: string, recipientId: string }): Promise<void> {
    const authId = client.handshake.auth.id
    const res = await this.postsService.deleteLike(authId, payload.postId)
    this.server.to(`${payload.recipientId}`).emit(`delLike`, res)
  }

}