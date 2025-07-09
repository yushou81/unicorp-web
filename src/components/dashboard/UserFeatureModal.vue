<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <div class="px-6 py-4 border-b flex justify-between items-center">
        <h3 class="text-lg font-semibold text-gray-900">完善个人特征信息</h3>
      </div>
      <div class="px-6 py-4">
        <form @submit.prevent="onSubmit">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">技能（必填，逗号分隔）</label>
            <input v-model="form.skillsStr" type="text" class="w-full border border-gray-300 rounded-md px-3 py-2" required placeholder="如：Java, Python, Excel, 数据分析" />
            <div class="text-xs text-gray-400 mt-1">多个请用逗号分隔。例如：Java, Python, Excel</div>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">兴趣领域（必填，逗号分隔）</label>
            <input v-model="form.interestsStr" type="text" class="w-full border border-gray-300 rounded-md px-3 py-2" required placeholder="如：AI, 前端开发, 机器学习, 金融科技" />
            <div class="text-xs text-gray-400 mt-1">多个请用逗号分隔。例如：AI, 前端开发, 机器学习</div>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">专业</label>
            <input v-model="form.major" type="text" class="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="如：计算机科学与技术" />
            <div class="text-xs text-gray-400 mt-1">例如：计算机科学与技术</div>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">学历</label>
            <input v-model="form.educationLevel" type="text" class="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="如：本科, 硕士, 博士" />
            <div class="text-xs text-gray-400 mt-1">例如：本科、硕士、博士</div>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">偏好工作类型（必填，逗号分隔）</label>
            <input v-model="form.preferredJobTypesStr" type="text" class="w-full border border-gray-300 rounded-md px-3 py-2" required placeholder="如：全职, 实习, 远程" />
            <div class="text-xs text-gray-400 mt-1">多个请用逗号分隔。例如：全职, 实习, 远程</div>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">偏好工作地点（必填）</label>
            <input v-model="form.preferredLocation" type="text" class="w-full border border-gray-300 rounded-md px-3 py-2" required placeholder="如：北京, 上海, 深圳" />
            <div class="text-xs text-gray-400 mt-1">支持多个城市，如：北京, 上海, 深圳</div>
          </div>
          <div class="flex justify-end mt-6">
            <button type="submit" class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-semibold" :disabled="submitting">
              {{ submitting ? '保存中...' : '保存' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'

const props = defineProps<{ initialData?: any }>()
const emit = defineEmits(['submit'])

const submitting = ref(false)

const form = ref({
  skillsStr: '',
  interestsStr: '',
  major: '',
  educationLevel: '',
  preferredJobTypesStr: '',
  preferredLocation: ''
})

watch(() => props.initialData, (val) => {
  if (val) {
    form.value.skillsStr = (val.skills || []).join(', ')
    form.value.interestsStr = (val.interests || []).join(', ')
    form.value.major = val.major || ''
    form.value.educationLevel = val.educationLevel || ''
    form.value.preferredJobTypesStr = (val.preferredJobTypes || []).join(', ')
    form.value.preferredLocation = val.preferredLocation || ''
  }
}, { immediate: true })

function onSubmit() {
  if (!form.value.skillsStr.trim() || !form.value.interestsStr.trim() || !form.value.preferredJobTypesStr.trim() || !form.value.preferredLocation.trim()) {
    alert('请填写所有必填项')
    return
  }
  submitting.value = true
  const data = {
    skills: form.value.skillsStr.split(',').map(s => s.trim()).filter(Boolean),
    interests: form.value.interestsStr.split(',').map(s => s.trim()).filter(Boolean),
    major: form.value.major,
    educationLevel: form.value.educationLevel,
    preferredJobTypes: form.value.preferredJobTypesStr.split(',').map(s => s.trim()).filter(Boolean),
    preferredLocation: form.value.preferredLocation
  }
  emit('submit', data)
  submitting.value = false
}
</script> 