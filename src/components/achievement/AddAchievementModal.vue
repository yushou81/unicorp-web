<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  show: boolean
  type?: 'PORTFOLIO' | 'AWARD' | 'RESEARCH' | null
  initialData?: any
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: any): void
}>()

const error = ref('')

const formData = ref({
  id: null as number | null,
  type: 'PORTFOLIO',
  title: '',
  description: '',
  date: '',
  tags: '',
  portfolioUrl: '',
  isPublic: true, // Default to public
  competitionName: '',
  awardLevel: '',
  issuer: '',
  publicationType: '',
  publicationVenue: '',
  authors: '',
  coverImage: null as File | null,
  researchFile: null as File | null,
})

const resetForm = () => {
  formData.value = {
    id: null,
    type: props.type ?? 'PORTFOLIO',
    title: '',
    description: '',
    date: '',
    tags: '',
    portfolioUrl: '',
    isPublic: true, // Reset to public
    competitionName: '',
    awardLevel: '',
    issuer: '',
    publicationType: '',
    publicationVenue: '',
    authors: '',
    coverImage: null,
    researchFile: null,
  }
  error.value = ''
}

watch(() => props.initialData, (newData) => {
  if (newData && Object.keys(newData).length) {
    formData.value = {
      ...formData.value,
      id: newData.id ?? null,
      type: props.type ?? 'PORTFOLIO',
      title: newData.title ?? '',
      description: newData.description ?? '',
      date: newData.awardDate ?? newData.publicationDate ?? newData.date ?? '',
      tags: Array.isArray(newData.tags) ? newData.tags.join(', ') : '',
      portfolioUrl: newData.projectUrl ?? '',
      competitionName: newData.competitionName ?? '',
      awardLevel: newData.awardLevel ?? '',
      issuer: newData.organizer ?? '',
      publicationType: newData.type ?? '',
      publicationVenue: newData.publisher ?? '',
      authors: Array.isArray(newData.authors) ? newData.authors.join(', ') : (newData.authors ?? ''),
    }
  } else {
    resetForm()
  }
}, { immediate: true, deep: true })

const isValid = computed(() => {
  return formData.value.title.trim() && formData.value.description.trim()
})

const handleSubmit = () => {
  if (!isValid.value) return
  emit('submit', { ...formData.value })
}

const handleClose = () => {
  resetForm()
  emit('close')
}
</script>

<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b flex justify-between items-center">
        <h3 class="text-lg font-semibold text-gray-900">{{ formData.id ? '编辑' : '添加' }}成果</h3>
        <button @click="handleClose" class="text-gray-400 hover:text-gray-500">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <!-- Modal Content -->
      <div class="px-6 py-4">
        <form @submit.prevent="handleSubmit">
          <!-- Achievement Type -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">成果类型</label>
            <select v-model="formData.type" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" :disabled="!!formData.id">
              <option value="PORTFOLIO">作品</option>
              <option value="AWARD">获奖</option>
              <option value="RESEARCH">科研成果</option>
            </select>
          </div>
          
          <!-- Common Fields -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">标题</label>
            <input v-model="formData.title" type="text" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="成果标题" required />
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">描述</label>
            <textarea v-model="formData.description" rows="3" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="成果详细描述" required></textarea>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">日期</label>
            <input v-model="formData.date" type="date" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">标签</label>
            <input v-model="formData.tags" type="text" class="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="用逗号分隔多个标签" />
          </div>

          <div class="mb-6">
            <label for="isPublicToggle" class="flex items-center cursor-pointer">
              <span class="mr-3 text-sm font-medium text-gray-900">设为公开</span>
              <div class="relative">
                <input type="checkbox" id="isPublicToggle" class="sr-only" v-model="formData.isPublic">
                <div class="block bg-gray-200 w-14 h-8 rounded-full transition-colors duration-300 ease-in-out"></div>
                <div class="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ease-in-out"></div>
              </div>
              <span class="ml-3 text-sm text-gray-500">{{ formData.isPublic ? '所有人可见' : '仅自己可见' }}</span>
            </label>
          </div>
          
          <!-- Portfolio Fields -->
          <template v-if="formData.type === 'PORTFOLIO'">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">作品链接</label>
              <input v-model="formData.portfolioUrl" type="text" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="作品展示链接(可选)" />
            </div>
          </template>
          
          <!-- Award Fields -->
          <template v-if="formData.type === 'AWARD'">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">竞赛名称</label>
              <input v-model="formData.competitionName" type="text" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="竞赛或比赛名称" />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">获奖级别</label>
              <select v-model="formData.awardLevel" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">选择获奖级别</option>
                <option value="national">国家级</option>
                <option value="provincial">省级</option>
                <option value="municipal">市级</option>
                <option value="school">校级</option>
                <option value="other">其他</option>
              </select>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">颁发机构</label>
              <input v-model="formData.issuer" type="text" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="颁发奖项的机构名称" />
            </div>
          </template>
          
          <!-- Research Fields -->
          <template v-if="formData.type === 'RESEARCH'">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">成果类型</label>
              <select v-model="formData.publicationType" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">选择成果类型</option>
                <option value="paper">论文</option>
                <option value="patent">专利</option>
                <option value="book">著作</option>
                <option value="other">其他</option>
              </select>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">发表venue</label>
              <input v-model="formData.publicationVenue" type="text" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="期刊/会议名称或专利申请号" />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">作者</label>
              <input v-model="formData.authors" type="text" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="用逗号分隔多个作者" />
            </div>
          </template>
          
          <!-- Submit Buttons -->
          <div class="flex justify-end space-x-3">
            <button type="button" @click="handleClose" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">取消</button>
            <button type="submit" :disabled="!isValid" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
              {{ formData.id ? '更新' : '提交' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template> 

<style scoped>
input:checked + .block {
  background-color: #4f46e5;
}
input:checked + .block + .dot {
  transform: translateX(100%);
}
</style> 