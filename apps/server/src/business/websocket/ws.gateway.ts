import { Inject } from '@nestjs/common'
import type { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets'
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

// import { ClientToServerEvents, ServerToClientEvents } from '@ying/shared'

import { SysAuthService } from '../admin/sys/auth/auth.service'

export type ServerSocket = Socket

export type ClientEvent<TData = any> = {
  // event: keyof ClientToServerEvents
  event: string
  listener: (client: ServerSocket, data: TData) => void
}

@WebSocketGateway()
export class WSGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @Inject()
  private readonly authService: SysAuthService
  @WebSocketServer()
  public server: Server
  public clientIdMap: Map<string, number> = new Map()
  private _clientEvents: ClientEvent[] = []

  async handleConnection(client: ServerSocket) {
    const token = client.handshake.auth.token as string | undefined
    if (!token) {
      this.authFail(client)
      return
    }
    try {
      const verifyData = await this.authService.verifyAccessToken(token)
      this.clientIdMap.set(client.id, verifyData.id)
      this.bindClientEvents(client)
    } catch {
      this.authFail(client)
    }
  }

  handleDisconnect(client: ServerSocket) {
    this.clientIdMap.delete(client.id)
  }

  authFail(client: ServerSocket) {
    client.emit('authFail')
    client.disconnect(true)
  }

  addClientEvent<T>(clientEvent: ClientEvent<T>) {
    this._clientEvents.push(clientEvent)
  }

  bindClientEvents(client: ServerSocket) {
    this._clientEvents.forEach(clientEvent => {
      client.on(clientEvent.event, data => clientEvent.listener(client, data))
    })
  }
}
