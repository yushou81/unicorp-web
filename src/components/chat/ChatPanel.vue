<template>
  <div class="bg-white rounded-xl shadow-sm p-8 mt-8 min-h-[500px] flex">
    <!-- 左侧：会话用户列表 -->
    <div class="w-64 border-r pr-4">
      <div class="font-bold text-lg mb-4">会话列表</div>
      <ul>
        <li v-for="session in chatSessions" :key="session.id" :class="['p-3 rounded cursor-pointer mb-2', selectedSessionId === session.id ? 'bg-indigo-100' : 'hover:bg-gray-50']" @click="selectSession(session.id)">
          <div class="flex items-center mb-1">
            <img :src="session.userAvatar || session.user?.avatar || defaultAvatar" class="w-8 h-8 rounded-full object-cover mr-2" alt="avatar" />
            <div class="font-medium">{{ session.userName || session.user?.nickname || '用户' }}</div>
          </div>
          <div class="text-xs text-gray-500 truncate">{{ session.lastMessage || session.lastMessage?.content || '暂无消息' }}</div>
          <div v-if="session.unreadCount > 0" class="text-xs text-red-500">未读 {{ session.unreadCount }}</div>
        </li>
        <li v-if="chatSessions.length === 0" class="text-gray-400 text-sm p-2">暂无会话</li>
      </ul>
    </div>
    <!-- 右侧：消息区 -->
    <div class="flex-1 pl-8">
      <div v-if="selectedSession">
        <div class="font-bold text-lg mb-2">与 {{ selectedSession.userName || selectedSession.user?.nickname || '用户' }} 的聊天</div>
        <div class="h-96 overflow-y-auto bg-gray-50 rounded p-4 mb-4">
          <div v-for="msg in chatMessages.slice().reverse()" :key="msg.id" class="mb-4 flex" :class="msg.senderId === myUserId ? 'justify-end' : 'justify-start'">
            <!-- 对方消息 -->
            <template v-if="msg.senderId !== myUserId">
              <img :src="msg.avatar || msg.senderAvatar || selectedSession.userAvatar || selectedSession.user?.avatar || defaultAvatar" class="w-9 h-9 rounded-full object-cover mr-2 self-end" alt="avatar" />
              <div>
                <div class="inline-block px-3 py-2 rounded-2xl bg-gray-200 text-gray-800 text-left max-w-xs break-words">
                  {{ msg.content }}
                </div>
                <div class="text-xs text-gray-400 mt-1 text-center w-full">
                  {{ formatDate(msg.sentAt) }}
                </div>
              </div>
            </template>
            <!-- 自己消息 -->
            <template v-else>
              <div>
                <div class="inline-block px-3 py-2 rounded-2xl bg-indigo-600 text-white text-right max-w-xs break-words">
                  {{ msg.content }}
                </div>
                <div class="text-xs text-gray-400 mt-1 text-center w-full">
                  {{ formatDate(msg.sentAt) }}
                </div>
              </div>
              <img :src="myAvatar" class="w-9 h-9 rounded-full object-cover ml-2 self-end" alt="avatar" />
            </template>
          </div>
        </div>
        <form class="flex" @submit.prevent="sendMessage">
          <input v-model="newMessage" class="flex-1 border rounded-l px-3 py-2 focus:outline-none" placeholder="输入消息..." />
          <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-r hover:bg-indigo-700">发送</button>
        </form>
      </div>
      <div v-else class="text-gray-400 flex items-center justify-center h-full">请选择一个会话</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { getChatSessions, getSessionMessages, sendChatMessage } from '@/lib/api/chat'
import { apiRequest } from '@/lib/api/apiClient'

const props = defineProps<{ myUserId?: number, myAvatar?: string }>()

const defaultAvatar = 'https://randomuser.me/api/portraits/men/32.jpg'

const chatSessions = ref<any[]>([])
const chatMessages = ref<any[]>([])
const selectedSessionId = ref<number|null>(null)
const selectedSession = computed(() => chatSessions.value.find(s => s.id === selectedSessionId.value))
const newMessage = ref('')
const sessionOtherUserIds = ref<Record<number, number>>({})

const myAvatar = computed(() => props.myAvatar || defaultAvatar)

async function fetchChatSessions() {
  try {
    const res = await getChatSessions()
    chatSessions.value = res.data || []
  } catch (e) {
    chatSessions.value = []
  }
}

async function fetchSessionMessages(sessionId: number) {
  try {
    const res = await getSessionMessages(sessionId)
    chatMessages.value = res.data || []
    if (typeof res.otherUserId === 'number') {
      sessionOtherUserIds.value[sessionId] = res.otherUserId
    }
  } catch (e) {
    chatMessages.value = []
  }
}

// 新增：标记消息为已读
async function markMessagesAsRead(sessionId: number) {
  try {
    await apiRequest(`/v1/chat/sessions/${sessionId}/read`, { method: 'POST' })
    fetchChatSessions() // 刷新会话列表，保证未读数消失
  } catch {}
}

function selectSession(sessionId: number) {
  selectedSessionId.value = sessionId
  fetchSessionMessages(sessionId)
  markMessagesAsRead(sessionId)
}

async function sendMessage() {
  if (!newMessage.value.trim() || !selectedSession.value) return
  const receiverId = sessionOtherUserIds.value[selectedSession.value.id] || selectedSession.value.user?.id || selectedSession.value.toUserId || selectedSession.value.targetUserId
  if (!receiverId) {
    alert('无法获取对方用户ID，无法发送消息')
    return
  }
  try {
    await sendChatMessage({
      sessionId: selectedSession.value.id,
      receiverId,
      content: newMessage.value.trim()
    })
    newMessage.value = ''
    fetchSessionMessages(selectedSession.value.id)
    markMessagesAsRead(selectedSession.value.id)
  } catch (e) {}
}

function formatDate(date) {
  console.log('formatDate input:', date)
  if (!date) return '-'
  if (typeof date === 'number') {
    const d = new Date(date)
    console.log('formatDate as number:', d)
    return isNaN(d.getTime()) ? '-' : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  let d = new Date(date)
  console.log('formatDate as string:', d)
  if (isNaN(d.getTime()) && typeof date === 'string') {
    let fixed = date.replace(' ', 'T')
    if (!fixed.endsWith('Z')) fixed += 'Z'
    d = new Date(fixed)
    console.log('formatDate fixed:', d)
  }
  if (isNaN(d.getTime())) {
    console.log('formatDate failed:', date)
    return date || '-'
  }
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

onMounted(() => {
  fetchChatSessions()
})
</script> 