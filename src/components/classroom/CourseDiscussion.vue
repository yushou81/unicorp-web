<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-900">课程讨论</h2>
      <Button v-if="canPost" size="sm" class="!px-4 !py-1.5" @click="showNewDialog = true">发起讨论</Button>
    </div>
    <div v-if="loading" class="flex justify-center py-8"><Loading /></div>
    <div v-else>
      <div v-if="discussionList.length === 0" class="text-gray-400 italic mb-8 text-center py-8 bg-gray-50 rounded-lg">暂无讨论，快来发表你的看法吧~</div>
      <div v-for="discussion in discussionList" :key="discussion.id" class="mb-8">
        <div class="flex items-start gap-3">
          <div class="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white shadow" :style="avatarStyle(discussion.userId)">
            {{ discussion.userName?.charAt(0) || '?' }}
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span class="font-medium text-blue-700">{{ discussion.userName }}</span>
              <span v-if="discussion.userRole" class="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-500 border border-blue-100 ml-1">{{ roleLabel(discussion.userRole) }}</span>
              <span class="ml-2 text-xs text-gray-400">{{ formatDate(discussion.createdAt) }}</span>
            </div>
            <div class="bg-gray-50 rounded-xl px-5 py-4 shadow mb-2 text-gray-900 text-base whitespace-pre-line border border-blue-50">{{ discussion.content }}</div>
            <!-- 回复区：左缩进竖线+↳ 回复 -->
            <div v-if="discussion.replies && discussion.replies.length" class="relative ml-4 pl-4 border-l-2 border-blue-100">
              <div v-for="reply in discussion.replies" :key="reply.id" class="flex items-start gap-2 mb-2">
                <div class="w-8 h-8 rounded-full flex items-center justify-center text-base font-bold text-white" :style="avatarStyle(reply.userId)">
                  {{ reply.userName?.charAt(0) || '?' }}
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-0.5">
                    <span class="text-xs text-blue-400 mr-1">↳ 回复</span>
                    <span class="font-medium text-green-700">{{ reply.userName }}</span>
                    <span v-if="reply.userRole" class="text-xs px-2 py-0.5 rounded bg-green-50 text-green-500 border border-green-100 ml-1">{{ roleLabel(reply.userRole) }}</span>
                    <span class="ml-2 text-xs text-gray-400">{{ formatDate(reply.createdAt) }}</span>
                  </div>
                  <div class="bg-white rounded-lg px-3 py-2 shadow border border-gray-100 text-gray-700 whitespace-pre-line text-sm">{{ reply.content }}</div>
                </div>
                <Button v-if="canEdit(reply)" size="xs" class="ml-1 !px-2 !py-0.5" @click="editDiscussion(reply)">编辑</Button>
                <Button v-if="canDelete(reply)" size="xs" class="ml-1 !px-2 !py-0.5" @click="deleteDiscussionConfirm(reply)" variant="danger">删除</Button>
              </div>
            </div>
            <div v-if="canPost" class="flex items-center mt-2 gap-2 ml-4">
              <input v-model="replyContent[discussion.id]" class="flex-1 border rounded px-2 py-1 text-sm mr-2" placeholder="回复..." @keyup.enter="submitReply(discussion.id)" />
              <Button size="xs" class="!px-3 !py-1" @click="submitReply(discussion.id)">回复</Button>
            </div>
            <div class="flex gap-2 mt-2">
              <Button v-if="canEdit(discussion)" size="xs" class="!px-3 !py-1" @click="editDiscussion(discussion)">编辑</Button>
              <Button v-if="canDelete(discussion)" size="xs" class="!px-3 !py-1" @click="deleteDiscussionConfirm(discussion)" variant="danger">删除</Button>
            </div>
          </div>
        </div>
      </div>
      <Pagination v-if="totalPages > 1" :current-page="page" :total-pages="totalPages" @page-change="changePage" class="mt-8" />
    </div>
    <!-- 新建/编辑讨论对话框 -->
    <div v-if="showNewDialog || editing" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-bold mb-4">{{ editing ? '编辑讨论' : '发起讨论' }}</h3>
        <textarea v-model="newContent" rows="4" class="w-full border rounded px-3 py-2 mb-4" placeholder="请输入讨论内容..." />
        <div class="flex justify-end space-x-2">
          <Button @click="closeDialog" variant="secondary">取消</Button>
          <Button @click="submitDiscussion" :disabled="submitting">{{ submitting ? '提交中...' : '提交' }}</Button>
        </div>
      </div>
    </div>
    <!-- 删除确认对话框 -->
    <div v-if="deleting" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-sm">
        <h3 class="text-lg font-bold mb-4">确认删除</h3>
        <p class="mb-4">确定要删除该讨论吗？</p>
        <div class="flex justify-end space-x-2">
          <Button @click="deleting = null" variant="secondary">取消</Button>
          <Button @click="confirmDelete" :disabled="submitting" variant="danger">删除</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { getCourseDiscussions, createDiscussion, getDiscussionReplies, updateDiscussion, deleteDiscussion } from '@/lib/api/classroom'
import Button from '@/components/ui/Button.vue'
import Pagination from '@/components/ui/Pagination.vue'
import Loading from '@/components/ui/Loading.vue'

const props = defineProps<{ courseId: number, canPost?: boolean, currentUserId?: number }>()

const discussions = ref<any[]>([])
const page = ref(1)
const size = ref(10)
const total = ref(0)
const loading = ref(false)
const showNewDialog = ref(false)
const newContent = ref('')
const submitting = ref(false)
const editing = ref<any>(null)
const deleting = ref<any>(null)
const replyContent = ref<Record<number, string>>({})

const totalPages = computed(() => Math.ceil(total.value / size.value))
const discussionList = computed(() => discussions.value || [])

function formatDate(date: string) {
  if (!date) return ''
  return new Date(date).toLocaleString()
}

function canEdit(item: any) {
  return props.currentUserId && item.userId === props.currentUserId
}
function canDelete(item: any) {
  return canEdit(item) // 可扩展为管理员/教师可删
}

// 美化相关方法
function avatarStyle(userId: number) {
  // 生成彩色背景
  const colors = ['#60a5fa','#f59e42','#34d399','#f472b6','#a78bfa','#fbbf24','#38bdf8','#f87171']
  const idx = userId ? userId % colors.length : 0
  return `background:${colors[idx]}`
}
function roleLabel(role: string) {
  if (!role) return ''
  const map: Record<string,string> = { TEACHER:'教师', STUDENT:'学生', MENTOR:'导师', ADMIN:'管理员', EN_TEACHER:'企业导师', SCH_ADMIN:'校管理员' }
  return map[role.toUpperCase()] || role
}

async function fetchDiscussions() {
  loading.value = true
  try {
    const res = await getCourseDiscussions(props.courseId, page.value, size.value)
    discussions.value = res.data?.records || []
    total.value = res.data?.total || 0
  } finally {
    loading.value = false
  }
}

function changePage(p: number) {
  page.value = p
  fetchDiscussions()
}

function closeDialog() {
  showNewDialog.value = false
  editing.value = null
  newContent.value = ''
}

async function submitDiscussion() {
  if (!newContent.value.trim()) return
  submitting.value = true
  try {
    if (editing.value) {
      await updateDiscussion(editing.value.id, newContent.value)
    } else {
      await createDiscussion({ courseId: props.courseId, content: newContent.value })
    }
    closeDialog()
    fetchDiscussions()
  } finally {
    submitting.value = false
  }
}

function editDiscussion(item: any) {
  editing.value = item
  newContent.value = item.content
  showNewDialog.value = true
}

function deleteDiscussionConfirm(item: any) {
  deleting.value = item
}

async function confirmDelete() {
  if (!deleting.value) return
  submitting.value = true
  try {
    await deleteDiscussion(deleting.value.id)
    deleting.value = null
    fetchDiscussions()
  } finally {
    submitting.value = false
  }
}

async function submitReply(parentId: number) {
  const content = replyContent.value[parentId]
  if (!content?.trim()) return
  submitting.value = true
  try {
    await createDiscussion({ courseId: props.courseId, parentId, content })
    replyContent.value[parentId] = ''
    fetchDiscussions()
  } finally {
    submitting.value = false
  }
}

watch(
  () => props.courseId,
  (newVal, oldVal) => {
    if (newVal && newVal !== oldVal) {
      fetchDiscussions()
    }
  },
  { immediate: true }
)
</script> 