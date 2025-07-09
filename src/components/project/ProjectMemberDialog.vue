<template>
  <div v-if="visible" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>
      
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      
      <div 
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <h3 class="text-lg font-medium text-gray-900 mb-4">{{ isEdit ? '编辑成员权限' : '添加项目成员' }}</h3>
          
          <form @submit.prevent="submitForm">
            <div v-if="!isEdit" class="mb-4">
              <label for="userId" class="block text-sm font-medium text-gray-700 mb-1">选择用户</label>
              <select
                id="userId"
                v-model="form.userId"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="" disabled>请选择用户</option>
                <option v-for="user in availableUsers" :key="user.userId" :value="user.userId">
                  {{ user.name }} ({{ user.email || user.phone }})
                </option>
              </select>
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">角色</label>
              <div class="space-y-2">
                <div v-for="role in availableRoles" :key="role.value" class="flex items-center">
                  <input
                    :id="`role-${role.value}`"
                    type="checkbox"
                    :value="role.value"
                    v-model="form.roles"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    :disabled="role.value === 'owner' && isEdit"
                  />
                  <label :for="`role-${role.value}`" class="ml-2 block text-sm text-gray-900">
                    {{ role.label }}
                  </label>
                </div>
              </div>
            </div>
            
            <div class="mb-4">
              <label for="expireAt" class="block text-sm font-medium text-gray-700 mb-1">到期时间（可选）</label>
              <input
                id="expireAt"
                v-model="form.expireAt"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                :min="minDate"
              />
            </div>
          </form>
        </div>
        
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button 
            type="button"
            @click="submitForm"
            :disabled="!isFormValid"
            :class="[
              'w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm',
              isFormValid ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500' : 'bg-gray-400 cursor-not-allowed'
            ]"
          >
            {{ isEdit ? '保存' : '添加' }}
          </button>
          <button 
            type="button"
            @click="$emit('close')"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, defineProps, defineEmits } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  projectId: {
    type: [Number, String],
    required: true
  },
  availableUsers: {
    type: Array,
    default: () => []
  },
  memberToEdit: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'submit'])

const isEdit = computed(() => !!props.memberToEdit)

const availableRoles = [
  { value: 'owner', label: '所有者' },
  { value: 'admin', label: '管理员' },
  { value: 'editor', label: '编辑者' },
  { value: 'viewer', label: '查看者' }
]

const form = ref({
  userId: '',
  roles: [] as string[],
  expireAt: ''
})

const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const isFormValid = computed(() => {
  if (isEdit.value) {
    return form.value.roles.length > 0
  } else {
    return form.value.userId && form.value.roles.length > 0
  }
})

watch(() => props.memberToEdit, (newVal) => {
  if (newVal) {
    form.value.userId = newVal.userId
    form.value.roles = [...newVal.roles]
    form.value.expireAt = newVal.expireTime ? new Date(newVal.expireTime).toISOString().split('T')[0] : ''
  } else {
    resetForm()
  }
}, { immediate: true })

watch(() => props.visible, (newVal) => {
  if (!newVal && !isEdit.value) {
    resetForm()
  }
})

function resetForm() {
  form.value = {
    userId: '',
    roles: [],
    expireAt: ''
  }
}

function submitForm() {
  if (!isFormValid.value) return
  
  const formData = {
    projectId: props.projectId,
    userId: form.value.userId,
    roles: form.value.roles,
    expireAt: form.value.expireAt || undefined
  }
  
  emit('submit', formData)
}
</script> 