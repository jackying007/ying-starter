import { useEffect } from 'react'
import { create } from 'zustand'
import { io, Socket } from 'socket.io-client'

import { useRefreshToken } from './userStore'

type SocketStore = {
  socket?: Socket
  connected: boolean
}

export const useSocketStore = create<SocketStore>(() => ({
  connected: false
}))

export const useSocketIo = () => {
  const refreshToken = useRefreshToken()

  useEffect(() => {
    if (!refreshToken) return

    const socket = io({
      path: '/admin-socket.io',
      auth: {
        token: refreshToken
      },
      transports: ['websocket']
    })
    socket.on('connect', () => {
      useSocketStore.setState({ connected: true })
    })
    socket.on('disconnect', () => {
      useSocketStore.setState({ connected: false })
    })

    useSocketStore.setState({ socket })

    return () => {
      socket.disconnect()
    }
  }, [refreshToken])
}
