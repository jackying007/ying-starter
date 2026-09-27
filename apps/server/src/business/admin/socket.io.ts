import { Server, Socket } from 'socket.io'
import type { ServerType } from '@hono/node-server'
import { sysAuthService } from '@/business/modules/sys'

export let socketIoServer: Server
export const clientSocketMap = new Map<
  string,
  {
    userId: number
    socket: Socket
  }
>()

export function initSocketIo(httpServer: ServerType) {
  socketIoServer = new Server(httpServer, {
    path: '/admin-socket.io',
    cors: {
      origin: '*'
    }
  })

  socketIoServer.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token
      if (!token) throw Error
      const verifyData = await sysAuthService.verifyRefreshToken(token)
      clientSocketMap.set(socket.id, {
        socket,
        userId: verifyData.id as number
      })
      next()
    } catch {
      next(new Error('Unauthorized'))
    }
  })

  socketIoServer.on('connection', socket => {
    console.log('socket connected:', socket.id)
    socket.on('disconnect', reason => {
      clientSocketMap.delete(socket.id)
      console.log('socket disconnected:', socket.id, reason)
    })
  })
}
