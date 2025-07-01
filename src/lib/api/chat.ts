import { apiRequest } from './apiClient'
import type { IMessage } from '@stomp/stompjs'
import { Client } from '@stomp/stompjs'
// @ts-ignore
import SockJS from 'sockjs-client'
// @ts-ignore
import Stomp from 'stompjs'

let stompClient: any = null

// 获取会话列表
export async function getChatSessions() {
  return apiRequest<any>('/v1/chat/sessions')
}

// 获取某个会话的消息
export async function getSessionMessages(sessionId: number) {
  return apiRequest<any>(`/v1/chat/sessions/${sessionId}/messages`)
}

// 发送消息
export async function sendChatMessage({ sessionId, receiverId, content }: { sessionId: number, receiverId: number, content: string }) {
  return apiRequest<any>('/v1/chat/messages', {
    method: 'POST',
    body: JSON.stringify({ sessionId, receiverId, content })
  })
}

export function connectChatWebSocket(token: string, onMessage: (msg: any) => void) {
  const socket = new SockJS('/api/ws')
  stompClient = Stomp.over(socket)
  stompClient.connect(
    { Authorization: 'Bearer ' + token },
    (frame: any) => {
      stompClient.subscribe('/user/queue/messages', (message: any) => {
        onMessage(JSON.parse(message.body))
      })
    }
  )
}

export function disconnectChatWebSocket() {
  if (stompClient) stompClient.disconnect()
} 