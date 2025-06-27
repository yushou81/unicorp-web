import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue')
    },
    {
      path: '/dashboard/student',
      name: 'dashboard-student',
      component: () => import('@/views/dashboard/StudentDashboard.vue')
    },
    {
      path: '/dashboard/company',
      name: 'dashboard-company',
      component: () => import('@/views/dashboard/CompanyAdminDashboard.vue')
    },
    {
      path: '/dashboard/school',
      name: 'dashboard-school',
      component: () => import('@/views/dashboard/SchoolAdminDashboard.vue')
    },
    {
      path: '/dashboard/teacher',
      name: 'dashboard-teacher',
      component: () => import('@/views/dashboard/TeacherDashboard.vue')
    },
    {
      path: '/dashboard/mentor',
      name: 'dashboard-mentor',
      component: () => import('@/views/dashboard/MentorDashboard.vue')
    },
    {
      path: '/dashboard/admin',
      name: 'dashboard-admin',
      component: () => import('@/views/dashboard/AdminDashboard.vue')
    },
    {
      path: '/apply',
      name: 'apply',
      component: () => import('@/views/ApplyView.vue')
    },
    {
      path: '/job',
      name: 'job',
      component: () => import('@/views/JobView.vue')
    },
    {
      path: '/job/:id',
      name: 'job-detail',
      component: () => import('@/views/JobDetailView.vue')
    },
    {
      path: '/learn',
      name: 'learn',
      component: () => import('@/views/LearnView.vue')
    },
    {
      path: '/project/list',
      name: 'project-list',
      component: () => import('@/views/project/ProjectListView.vue')
    },
    {
      path: '/project/publish',
      name: 'project-publish',
      component: () => import('@/views/project/ProjectPublishView.vue')
    },
    {
      path: '/project/:id',
      name: 'project-detail',
      component: () => import('@/views/project/ProjectDetailView.vue')
    },
    {
      path: '/project/:id/fund',
      name: 'project-fund',
      component: () => import('@/views/project/ProjectFundView.vue')
    },
    {
        path: '/logs',
        name: 'logs',
        component: () => import('@/views/dashboard/OperationLogs.vue')
      },
      {
        path: '/accounts',
        name: 'accounts',
        component: () => import('@/views/dashboard/Accounts.vue')
      },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFound.vue')
    }
  ]
})

export default router 