import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import JobView from '@/views/JobView.vue'
import JobDetailView from '@/views/JobDetailView.vue'
import ClassroomListView from '@/views/classroom/ClassroomListView.vue'
import ClassroomDetailView from '@/views/classroom/ClassroomDetailView.vue'
import TeacherCourseManager from '@/views/classroom/TeacherCourseManager.vue'
import CourseChapterView from '@/views/classroom/CourseChapterView.vue'
import CourseRatingManagement from '@/views/classroom/CourseRatingManagement.vue'
import StudentDashboard from '@/views/dashboard/StudentDashboard.vue'
import CompanyAdminDashboard from '@/views/dashboard/CompanyAdminDashboard.vue'
import TeacherDashboard from '@/views/dashboard/TeacherDashboard.vue'
import AdminDashboard from '@/views/dashboard/AdminDashboard.vue'
import MentorDashboard from '@/views/dashboard/MentorDashboard.vue'
import SchoolAdminDashboard from '@/views/dashboard/SchoolAdminDashboard.vue'
import LoginSuccessView from '@/views/LoginSuccessView.vue'
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
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/login-success',
      name: 'login-success',
      component: LoginSuccessView
    },
    {
      path: '/job',
      name: 'job-list',
      component: JobView
    },
    {
      path: '/job/:id',
      name: 'job-detail',
      component: JobDetailView
    },
    {
      path: '/classroom',
      name: 'classroom-list',
      component: ClassroomListView
    },
    {
      path: '/classroom/manage',
      name: 'classroom-manage',
      component: TeacherCourseManager,
      meta: { requiresAuth: true }
    },
    {
      path: '/classroom/:id',
      name: 'classroom-detail',
      component: ClassroomDetailView
    },
    {
      path: '/classroom/:courseId/chapter/:chapterId',
      name: 'course-chapter',
      component: CourseChapterView
    },
    {
      path: '/classroom/:courseId/ratings',
      name: 'course-rating-management',
      component: CourseRatingManagement,
      meta: { requiresAuth: true }
    },
    {
      path: '/classroom/course/:id',
      name: 'CourseDetail',
      component: () => import('@/views/classroom/CourseDetailView.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      redirect: to => {
        const appStore = useAppStore()
        if (!appStore.user) {
          return { name: 'login' }
        }
        
        // 获取角色并统一转大写
        const user = appStore.user as any
        const role = (user.role || '').toUpperCase()
        console.log('重定向处理用户角色:', role) // 调试用
        
        switch (role) {
          case 'STUDENT':
            return { name: 'student-dashboard' }
          case 'EN_ADMIN':
          case 'COMPANYADMIN':
          case 'EN_ADMIN':
            return { name: 'company-dashboard' }
          case 'TEACHER':
            return { name: 'teacher-dashboard' }
          case 'SYSADMIN':
          case 'ADMIN':
            return { name: 'admin-dashboard' }
          case 'MENTOR':
          case 'EN_TEACHER':
            return { name: 'mentor-dashboard' } // 添加企业导师路由
          case 'SCHOOL_ADMIN':
          case 'SCH_ADMIN':
            return { name: 'school-dashboard' } // 添加学校管理员路由
          default:
            console.log('未匹配到角色，回到首页:', role)
            return { name: 'home' }
        }
      }
    },
    {
      path: '/dashboard/student',
      name: 'student-dashboard',
      component: StudentDashboard,
      meta: { requiresAuth: true }
    },
    {
      path: '/dashboard/company',
      name: 'company-dashboard',
      component: CompanyAdminDashboard,
      meta: { requiresAuth: true }
    },
    {
      path: '/dashboard/teacher',
      name: 'teacher-dashboard',
      component: TeacherDashboard,
      meta: { requiresAuth: true }
    },
    {
      path: '/dashboard/admin',
      name: 'admin-dashboard',
      component: AdminDashboard,
      meta: { requiresAuth: true }
    },
    {
      path: '/dashboard/mentor',
      name: 'mentor-dashboard',
      component: MentorDashboard,
      meta: { requiresAuth: true }
    },
    {
      path: '/dashboard/school',
      name: 'school-dashboard',
      component: SchoolAdminDashboard,
      meta: { requiresAuth: true }
    },
    {
      path: '/apply',
      name: 'apply',
      component: () => import('@/views/ApplyView.vue')
    },
    {
      path: '/learn',
      name: 'learn',
      component: () => import('@/views/LearnView.vue')
    },

    {
      path: '/resource',
      name: 'resource',
      component: () => import('@/views/ResourceView.vue')
    },
    {
      path: '/project/edit/:projectId',
      name: 'ProjectEdit',
      component: () => import('@/views/project/ProjectEditView.vue')
    },
    // 项目合作管理路由
    // {
    //   path: '/project/list',
    //   name: 'project-list',
    //   component: () => import('@/views/project/ProjectListView.vue'),
    //   meta: { requiresAuth: true }
    // },

    {
      path: '/project/publish',
      name: 'project-publish',
      component: () => import('@/views/project/ProjectPublishView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/project/detail/:projectId',
      name: 'project-detail',
      component: () => import('@/views/project/ProjectDetailView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/project/:id/fund',
      name: 'project-fund',
      component: () => import('@/views/project/ProjectFundView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/project/:id/fund-readonly',
      name: 'project-fund-readonly',
      component: () => import('@/views/project/ProjectFundReadonlyView.vue')
    },
    {
      path: '/project/my',
      name: 'my-project-list',
      component: () => import('@/views/project/MyProjectListView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/project/search',
      name: 'project-search',
      component: () => import('@/views/project/ProjectSearchView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/resource',
      name: 'resource',
      component: () => import('@/views/ResourceView.vue')
    },
    {
      path: '/resource/upload',
      name: 'resource-upload',
      component: () => import('@/views/resource/ResourceUploadView.vue')
    },
    {
      path: '/resource/:id',
      name: 'resource-detail',
      component: () => import('@/views/ResourceDetailView.vue')
    },
    {
      path: '/dashboard/my-bookings',
      name: 'my-bookings',
      component: () => import('@/views/dashboard/MyBookingsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/equipment/bookings',
      name: 'equipment-bookings',
      component: () => import('@/views/resource/EquipmentBookingManageView.vue')
    },
    // {
    //   path: '/teacher/projects',
    //   name: 'TeacherProjectManage',
    //   component: () => import('@/views/project/TeacherProjectManageView.vue'),
    //   meta: { requiresAuth: true, role: 'teacher' }
    // },
    {
      path: '/project/audit',
      name: 'project-audit',
      component: () => import('@/views/project/ProjectAuditView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/my-project-applications',
      name: 'MyProjectApplications',
      component: () => import('@/views/project/MyProjectApplicationView.vue'),
      meta: { requiresAuth: true }
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
    },
    {
      path: '/nearby-map',
      name: 'nearby-map',
      component: () => import('@/views/NearbyLocationMapView.vue')
    },
    {
      path: '/location-picker-test',
      name: 'location-picker-test',
      component: () => import('@/views/LocationPickerTest.vue')
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
    
    const allowedRoles = ['SYSADMIN', 'admin', 'ADMIN']
    if (!allowedRoles.includes(user.role)) {
      console.warn(`用户角色 ${user.role} 尝试访问管理员面板`)
      next('/')
      return
    }
  }
  
  // 检查项目合作管理相关路由的权限
  if (to.path.startsWith('/project/')) {
    const user = appStore.user as any
    if (!user) {
      next('/login')
      return
    }
    
    // 根据具体路由检查权限
    if (to.path === '/project/publish' && !appStore.hasProjectPermission('publish_project')) {
      next('/dashboard')
      return
    }
    
    if (to.path === '/project/application' && !appStore.hasProjectPermission('review_application')) {
      next('/dashboard')
      return
    }
  }
  
  if (to.meta.requiresAuth && !appStore.user) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router 