import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class UserWsJwtAuthGuard implements CanActivate {
  constructor(
  ) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient() as Socket;
    if (!client['user']) {
      client.disconnect();
      throw new WsException('Unauthorized');
    }
    return true;
  }
}