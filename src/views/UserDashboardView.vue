<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10">
    <div class="container mx-auto px-4">
      <component :is="dashboardComponent" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'

// 各角色专属dashboard组件
import StudentDashboard from './dashboard/StudentDashboard.vue'
import CompanyAdminDashboard from './dashboard/CompanyAdminDashboard.vue'
import SchoolAdminDashboard from './dashboard/SchoolAdminDashboard.vue'
import TeacherDashboard from './dashboard/TeacherDashboard.vue'
import MentorDashboard from './dashboard/MentorDashboard.vue'
import AdminDashboard from './dashboard/AdminDashboard.vue'

const appStore = useAppStore()
const user = computed(() => appStore.user)

const dashboardComponent = computed(() => {
  switch (user.value?.role) {
    case 'student':
      return StudentDashboard
    case 'companyAdmin':
      return CompanyAdminDashboard
    case 'schoolAdmin':
      return SchoolAdminDashboard
    case 'teacher':
      return TeacherDashboard
    case 'mentor':
      return MentorDashboard
    case 'admin':
      return AdminDashboard
    default:
      return StudentDashboard // 默认学生
  }
})
</script> 