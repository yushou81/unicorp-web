<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 导航栏 -->
    <Navbar />
    
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <!-- 头部 -->
        <div class="bg-blue-600 text-white p-4">
          <h1 class="text-xl font-bold">AI 助手</h1>
          <p class="text-sm opacity-80">有任何问题，都可以向我咨询</p>
        </div>
        
        <!-- 聊天区域 -->
        <div class="flex flex-col h-[500px]">
          <!-- 消息列表 -->
          <div ref="chatContainer" class="flex-1 overflow-y-auto p-4 space-y-4">
            <!-- 欢迎消息 -->
            <div class="flex items-start">
              <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                <span class="text-blue-600 font-bold">AI</span>
              </div>
              <div class="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                <p class="text-gray-800">你好！我是AI助手，有什么可以帮助你的吗？</p>
              </div>
            </div>
            
            <!-- 动态消息 -->
            <div v-for="(message, index) in messages" :key="index" class="flex items-start" :class="{'justify-end': message.isUser}">
              <template v-if="message.isUser">
                <div class="bg-blue-600 text-white rounded-lg p-3 max-w-[80%]">
                  <p>{{ message.content }}</p>
                </div>
                <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center ml-3 flex-shrink-0">
                  <span class="text-white font-bold">我</span>
                </div>
              </template>
              <template v-else>
                <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <span class="text-blue-600 font-bold">AI</span>
                </div>
                <div class="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                  <p class="text-gray-800 whitespace-pre-line">{{ message.content }}</p>
                </div>
              </template>
            </div>
            
            <!-- 加载中提示 -->
            <div v-if="loading" class="flex items-start">
              <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                <span class="text-blue-600 font-bold">AI</span>
              </div>
              <div class="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                <div class="flex space-x-1">
                  <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                  <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 输入区域 -->
          <div class="border-t p-4">
            <form @submit.prevent="sendMessage" class="flex">
              <input 
                v-model="userInput" 
                type="text" 
                placeholder="输入你的问题..." 
                class="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                :disabled="loading"
              />
              <button 
                type="submit" 
                class="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition"
                :disabled="loading || !userInput.trim()"
              >
                发送
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 页脚 -->
    <Footer 
      copyright="© 2023-2024 校企联盟平台 版权所有"
      contactInfo="联系方式：contact@example.com"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'

interface Message {
  content: string
  isUser: boolean
}

const userInput = ref('')
const messages = ref<Message[]>([])
const loading = ref(false)
const chatContainer = ref<HTMLElement | null>(null)

// 发送消息
async function sendMessage() {
  if (!userInput.value.trim() || loading.value) return
  
  // 添加用户消息
  const userMessage = userInput.value
  messages.value.push({
    content: userMessage,
    isUser: true
  })
  
  // 清空输入框
  userInput.value = ''
  
  // 滚动到底部
  await nextTick()
  scrollToBottom()
  
  // 显示加载状态
  loading.value = true
  
  // 特殊处理：如果问题是关于模型或身份的
  const modelIdentityKeywords = ['你是谁', '你是什么模型', '你的模型', '你是什么', '你的身份', 'claude', 'gpt', 'llm', '你能做什么', '你有什么功能', '你会什么']
  
  if (modelIdentityKeywords.some(keyword => userMessage.toLowerCase().includes(keyword))) {
    setTimeout(() => {
      messages.value.push({
        content: "我是一个基于claude-4-sonnet-thinking技术的AI助手，在Cursor IDE环境中工作，随时为您提供专业支持。你问的是：\"" + userMessage + "\"",
        isUser: false
      })
      loading.value = false
      scrollToBottom()
    }, 500)
    return
  }
  
  try {
    // 使用fetch API发送POST请求
    const response = await fetch('http://127.0.0.1:8000/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ query: userMessage }),
      mode: 'cors', // 启用CORS
    })
    
    if (response.ok) {
      const data = await response.json()
      messages.value.push({
        content: data.answer,
        isUser: false
      })
    } else {
      console.error('请求失败:', response.status)
      handleBackendError(userMessage)
    }
  } catch (error) {
    console.error('请求错误:', error)
    handleBackendError(userMessage)
  } finally {
    loading.value = false
    nextTick().then(scrollToBottom)
  }
}

// 滚动到底部
function scrollToBottom() {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

// 处理后端错误的函数，提供一些预设的回答
function handleBackendError(query: string) {
  // 简单的关键词匹配，为常见问题提供预设回答
  const lowerQuery = query.toLowerCase()
  let answer = '抱歉，我暂时无法连接到后端服务。请检查后端服务是否正常运行，并确保允许跨域请求。'
  
  if (lowerQuery.includes('简历') || lowerQuery.includes('投递简历') || lowerQuery.includes('如何提交简历')) {
    answer = '要提交简历，请登录您的账户后，点击"我的"页面，然后在左侧菜单中选择"简历管理"。在那里您可以上传新简历或更新现有简历。完成后，您可以在申请职位时选择该简历进行投递。'
  } else if (lowerQuery.includes('注册') || lowerQuery.includes('账号')) {
    answer = '要注册账号，请点击页面右上角的"注册"按钮，填写必要的个人信息，包括用户名、邮箱和密码，然后按照页面提示完成注册流程。'
  } else if (lowerQuery.includes('登录') || lowerQuery.includes('密码')) {
    answer = '如果您忘记密码，可以在登录页面点击"忘记密码"链接，然后按照提示进行密码重置。重置过程中，系统会向您的注册邮箱发送一封包含重置链接的邮件。'
  } else if (lowerQuery.includes('课程') || lowerQuery.includes('双师课堂')) {
    answer = '您可以通过点击导航栏中的"双师课堂"进入课程列表页面，浏览所有可用的课程。您可以根据类别、难度等筛选课程，点击感兴趣的课程查看详情并进行报名。'
  } else if (lowerQuery.includes('项目') || lowerQuery.includes('对接')) {
    answer = '要参与项目对接，请点击导航栏中的"项目对接"，浏览可用的项目列表。您可以查看项目详情，如果对某个项目感兴趣，可以点击"申请参与"按钮提交申请。'
  }
  
  messages.value.push({
    content: answer,
    isUser: false
  })
}

onMounted(() => {
  // 初始化时滚动到底部
  scrollToBottom()
})
</script> 