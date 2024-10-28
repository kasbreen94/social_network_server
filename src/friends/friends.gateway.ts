import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { FriendsService } from './friends.service';
import { CreateFriendDto } from './dto/create-friend.dto';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class FriendsGateway {
  constructor(private readonly friendsService: FriendsService) {}

  @WebSocketServer() server: Server

  @SubscribeMessage('createFriend')
  async create(@ConnectedSocket() client: Socket, @MessageBody() createFriendDto: CreateFriendDto) {
    const authId = client.handshake.auth.id
    const isFriend = await this.friendsService.create(authId, createFriendDto);
    this.server.to(`${authId}`).emit(`createFriend`, isFriend)
  }

  @SubscribeMessage('deleteFriend')
  async delete(@ConnectedSocket() client: Socket, @MessageBody() userId: number) {
    const authId = client.handshake.auth.id
    const isFriend = await this.friendsService.remove(authId, userId);
    this.server.to(`${authId}`).emit(`deleteFriend`, isFriend)
  }
}
