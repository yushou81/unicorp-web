import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { getMe } from '@/lib/api/auth'
import { setToken } from '@/lib/api/apiClient'
import { useAppStore } from '@/stores/app'

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
      path: '/classroom',
      name: 'classroom',
      component: () => import('@/views/classroom/ClassroomListView.vue')
    },
    {
      path: '/classroom/:id',
      name: 'classroom-detail',
      component: () => import('@/views/classroom/ClassroomDetailView.vue')
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

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  const appStore = useAppStore()
  const token = localStorage.getItem('token')
  
  // 如果有token但没有用户信息，尝试获取用户信息
  if (token && !appStore.user) {
    try {
      setToken(token)
      const userInfo = await getMe() as any
      if (userInfo && userInfo.data) {
        appStore.setUser(userInfo.data)
      }
    } catch (e) {
      console.error('获取用户信息失败:', e)
      // 如果获取用户信息失败，可能是token过期，清除token
      localStorage.removeItem('token')
      appStore.logout()
    }
  }
  
  // 检查管理员路由的权限
  if (to.path === '/dashboard/admin') {
    const user = appStore.user as any
    if (!user) {
      next('/login')
      return
    }
    
    const allowedRoles = ['SYSADMIN', 'admin']
    if (!allowedRoles.includes(user.role)) {
      console.warn(`用户角色 ${user.role} 尝试访问管理员面板`)
      next('/')
      return
    }
  }
  
  next()
})

export default router 