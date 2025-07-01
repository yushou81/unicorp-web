<template>
  <button 
    @click="handleClick" 
    :disabled="disabled"
    :class="[
      'px-6 py-2 rounded-lg transition-colors flex items-center',
      !disabled
        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
    ]"
  >
    <svg v-if="isEnrolled" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
    </svg>
    {{ buttonText }}
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { DualTeacherCourseVO, CourseStatus, enrollCourse, cancelEnrollment } from '@/lib/api/classroom'
import { useAppStore } from '@/stores/app'

const props = defineProps<{
  course: DualTeacherCourseVO
  isEnrolled: boolean
}>()

const emit = defineEmits<{
  (e: 'enroll'): void
  (e: 'cancel'): void
  (e: 'error', message: string): void
}>()

const appStore = useAppStore()

// 计算按钮文本
const buttonText = computed(() => {
  if (props.isEnrolled) {
    return '取消报名'
  }
  return '立即报名'
})

// 计算按钮是否禁用
const disabled = computed(() => {
  // 课程已结束或已取消时禁用
  if (props.course.status === CourseStatus.COMPLETED || props.course.status === CourseStatus.CANCELLED) {
    return true
  }
  
  // 课程人数已满且未报名时禁用
  if (props.course.enrolledCount >= props.course.maxStudents && !props.isEnrolled) {
    return true
  }
  
  // 课程未开放报名且未报名时禁用
  if (props.course.status !== CourseStatus.OPEN && !props.isEnrolled) {
    return true
  }
  
  // 未登录时禁用
  if (!appStore.user) {
    return true
  }
  
  return false
})

// 处理按钮点击
const handleClick = async () => {
  if (disabled.value) {
    return
  }
  
  try {
    if (props.isEnrolled) {
      // 已报名，执行取消报名
      await cancelEnrollment(props.course.id)
      emit('cancel')
    } else {
      // 未报名，执行报名
      await enrollCourse(props.course.id)
      emit('enroll')
    }
  } catch (error) {
    console.error('报名操作失败:', error)
    emit('error', error instanceof Error ? error.message : '操作失败，请稍后再试')
  }
}
</script> 