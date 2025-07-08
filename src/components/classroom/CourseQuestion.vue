<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold text-gray-900">课程问答</h2>
      <Button v-if="canAsk" size="sm" @click="showAskDialog = true">我要提问</Button>
    </div>
    <div v-if="loading" class="flex justify-center py-8"><Loading /></div>
    <div v-else>
      <div v-if="questions.length === 0" class="text-gray-400 italic mb-8 text-center py-8 bg-gray-50 rounded-lg">暂无问答，快来提第一个问题吧~</div>
      <div v-for="q in questions" :key="q.id" class="mb-8">
        <div class="flex items-start gap-3 bg-white rounded-xl shadow p-5 border border-blue-50">
          <div class="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white shadow" :style="avatarStyle(q.studentId)">
            {{ q.studentName?.charAt(0) || '?' }}
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span class="font-medium text-blue-700 text-base">{{ q.studentName }}</span>
              <span class="ml-2 text-xs text-gray-400">{{ formatDate(q.createdAt) }}</span>
              <Button v-if="canEdit(q)" size="xs" class="ml-2 !px-2 !py-0.5" @click="editQuestion(q)">编辑</Button>
              <Button v-if="canDelete(q)" size="xs" class="ml-2 !px-2 !py-0.5" @click="deleteQuestionConfirm(q)">删除</Button>
            </div>
            <div class="font-bold text-lg text-gray-900 mb-1">{{ q.title }}</div>
            <div class="bg-gray-50 rounded-lg px-4 py-3 mb-2 text-gray-800 whitespace-pre-line border border-blue-50">{{ q.content }}</div>
            <div v-if="q.answer" class="bg-green-50 rounded-lg p-4 mb-2 border-l-4 border-green-400">
              <div class="flex items-center mb-1">
                <span class="font-medium text-green-700">{{ q.answerUserName || '教师/导师' }}</span>
                <span class="ml-2 text-xs text-gray-400">{{ formatDate(q.answeredAt) }}</span>
              </div>
              <div class="text-gray-700 whitespace-pre-line">{{ q.answer }}</div>
            </div>
            <div v-else-if="canAnswer(q)" class="flex items-center gap-2 mt-2">
              <input v-model="answerContent[q.id]" class="flex-1 border rounded px-2 py-1 text-sm mr-2" placeholder="输入回答...（10-2000字）" @keyup.enter="submitAnswer(q.id)" maxlength="2000" />
              <Button size="xs" class="!px-3 !py-1" @click="submitAnswer(q.id)">回答</Button>
            </div>
            <div v-else-if="q.status === 'pending'" class="text-xs text-gray-400 italic mt-2">等待教师/导师回答</div>
          </div>
        </div>
      </div>
      <Pagination v-if="totalPages > 1" :current-page="page" :total-pages="totalPages" @page-change="changePage" />
    </div>
    <!-- 新建/编辑提问对话框 -->
    <div v-if="showAskDialog || editing" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-bold mb-4">{{ editing ? '编辑问题' : '我要提问' }}</h3>
        <input v-model="askTitle" class="w-full border rounded px-3 py-2 mb-2" placeholder="问题标题...（5-200字）" maxlength="200" />
        <div class="text-xs text-gray-400 mb-2">{{ askTitle.length }}/200</div>
        <textarea v-model="askContent" rows="4" class="w-full border rounded px-3 py-2 mb-2" placeholder="请输入问题内容...（10-2000字）" maxlength="2000" />
        <div class="text-xs text-gray-400 mb-4">{{ askContent.length }}/2000</div>
        <div class="flex justify-end space-x-2">
          <Button @click="closeDialog" variant="secondary">取消</Button>
          <Button @click="submitQuestion" :disabled="submitting">{{ submitting ? '提交中...' : '提交' }}</Button>
        </div>
      </div>
    </div>
    <!-- 删除确认对话框 -->
    <div v-if="deleting" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-sm">
        <h3 class="text-lg font-bold mb-4">确认删除</h3>
        <p class="mb-4">确定要删除该问题吗？</p>
        <div class="flex justify-end space-x-2">
          <Button @click="deleting = null" variant="secondary">取消</Button>
          <Button @click="confirmDelete" :disabled="submitting" variant="danger">删除</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getCourseQuestions, askQuestion, answerQuestion, updateQuestion, deleteQuestion } from '@/lib/api/classroom'
import Button from '@/components/ui/Button.vue'
import Pagination from '@/components/ui/Pagination.vue'
import Loading from '@/components/ui/Loading.vue'

const props = defineProps<{ courseId: number, canAsk?: boolean, canAnswer?: boolean, currentUserId?: number, userRole?: string }>()

const questions = ref<any[]>([])
const page = ref(1)
const size = ref(10)
const total = ref(0)
const loading = ref(false)
const showAskDialog = ref(false)
const askTitle = ref('')
const askContent = ref('')
const submitting = ref(false)
const editing = ref<any>(null)
const deleting = ref<any>(null)
const answerContent = ref<Record<number, string>>({})

const totalPages = computed(() => Math.ceil(total.value / size.value))

function formatDate(date: string) {
  if (!date) return ''
  return new Date(date).toLocaleString()
}

function canEdit(q: any) {
  return props.currentUserId && q.studentId === props.currentUserId
}
function canDelete(q: any) {
  return canEdit(q) // 可扩展为管理员/教师可删
}
function canAnswer(q: any) {
  // 教师/导师且未回答
  return props.canAnswer && q.status === 'pending'
}

function avatarStyle(userId: number) {
  // 生成彩色背景
  const colors = ['#60a5fa','#f59e42','#34d399','#f472b6','#a78bfa','#fbbf24','#38bdf8','#f87171']
  const idx = userId ? userId % colors.length : 0
  return `background:${colors[idx]}`
}

async function fetchQuestions() {
  loading.value = true
  try {
    const res = await getCourseQuestions(props.courseId, page.value, size.value)
    questions.value = res.data?.records || []
    total.value = res.data?.total || 0
  } finally {
    loading.value = false
  }
}

function changePage(p: number) {
  page.value = p
  fetchQuestions()
}

function closeDialog() {
  showAskDialog.value = false
  editing.value = null
  askTitle.value = ''
  askContent.value = ''
}

async function submitQuestion() {
  // 字数校验
  if (!askTitle.value.trim() || !askContent.value.trim()) {
    alert('请填写问题标题和内容');
    return
  }
  if (askTitle.value.length < 5 || askTitle.value.length > 200) {
    alert('问题标题长度应在5-200个字符之间');
    return
  }
  if (askContent.value.length < 10 || askContent.value.length > 2000) {
    alert('问题内容长度应在10-2000个字符之间');
    return
  }
  submitting.value = true
  try {
    if (editing.value) {
      await updateQuestion(editing.value.id, { courseId: props.courseId, title: askTitle.value, content: askContent.value })
    } else {
      await askQuestion({ courseId: props.courseId, title: askTitle.value, content: askContent.value })
    }
    closeDialog()
    fetchQuestions()
  } finally {
    submitting.value = false
  }
}

function editQuestion(q: any) {
  editing.value = q
  askTitle.value = q.title
  askContent.value = q.content
  showAskDialog.value = true
}

function deleteQuestionConfirm(q: any) {
  deleting.value = q
}

async function confirmDelete() {
  if (!deleting.value) return
  submitting.value = true
  try {
    await deleteQuestion(deleting.value.id)
    deleting.value = null
    fetchQuestions()
  } finally {
    submitting.value = false
  }
}

async function submitAnswer(id: number) {
  const content = answerContent.value[id]
  if (!content?.trim()) {
    alert('请输入回答内容');
    return
  }
  if (content.length < 10 || content.length > 2000) {
    alert('回答内容长度应在10-2000个字符之间');
    return
  }
  submitting.value = true
  try {
    await answerQuestion(id, content)
    answerContent.value[id] = ''
    fetchQuestions()
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchQuestions()
})
</script> 