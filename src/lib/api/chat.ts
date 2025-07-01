import { apiRequest } from './apiClient'

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