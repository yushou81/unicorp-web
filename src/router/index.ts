import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import JobView from '@/views/JobView.vue'
import JobDetailView from '@/views/JobDetailView.vue'
import ClassroomListView from '@/views/classroom/ClassroomListView.vue'
import ClassroomDetailView from '@/views/classroom/ClassroomDetailView.vue'
import TeacherCourseManager from '@/views/classroom/TeacherCourseManager.vue'
import CourseChapterView from '@/views/classroom/CourseChapterView.vue'

import StudentDashboard from '@/views/dashboard/StudentDashboard.vue'
import CompanyAdminDashboard from '@/views/dashboard/CompanyAdminDashboard.vue'
import TeacherDashboard from '@/views/dashboard/TeacherDashboard.vue'
import AdminDashboard from '@/views/dashboard/AdminDashboard.vue'
import MentorDashboard from '@/views/dashboard/MentorDashboard.vue'
import SchoolAdminDashboard from '@/views/dashboard/SchoolAdminDashboard.vue'
import LoginSuccessView from '@/views/LoginSuccessView.vue'
import { getMe } from '@/lib/api/auth'
import { useAppStore } from '@/stores/app'

// 添加成果展示相关的组件导入
import AchievementOverview from '@/views/achievement/StudentAchievement.vue'
import TeacherVerifyView from '@/views/achievement/TeacherVerifyView.vue'
import EnterpriseAchievementView from '@/views/achievement/EnterpriseAchievementView.vue'
import SchoolAchievementManageView from '@/views/achievement/SchoolAchievementManageView.vue'
import SchoolAchievementDetailView from '@/views/achievement/SchoolAchievementDetailView.vue'
import AdminAchievementManageView from '@/views/achievement/AdminAchievementManageView.vue'

// 成果详情页面
const AwardDetailView = () => import('@/views/achievement/AwardDetailView.vue')
const PortfolioDetailView = () => import('@/views/achievement/PortfolioDetailView.vue')
const ResearchDetailView = () => import('@/views/achievement/ResearchDetailView.vue')

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
      name: 'course-chapters',
      component: CourseChapterView
    },
    {
      path: '/classroom/:courseId/chapter/:chapterId/edit',
      name: 'chapter-edit',
      component: () => import('@/views/classroom/ChapterEditView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/classroom/test',
      name: 'chapter-test',
      component: () => import('@/views/classroom/ChapterTestView.vue')
    },

    {
      path: '/classroom/course/:id',
      name: 'CourseDetail',
      component: () => import('@/views/classroom/CourseDetailView.vue')
    },
    {
      path: '/ai-assistant',
      name: 'ai-assistant',
      component: () => import('@/views/AIAssistantView.vue')
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
        path: '/logs',
        name: 'logs',
        component: () => import('@/views/dashboard/OperationLogs.vue')
      },
      {
        path: '/accounts',
        name: 'accounts',
        component: () => import('@/views/dashboard/Accounts.vue')
      },
    
    // 学校管理员路由
    {
      path: '/admin/school',
      component: () => import('@/views/admin/AdminLayout.vue'),
      meta: { requiresAuth: true, role: 'SCHOOL_ADMIN' },
      children: [
        {
          path: '',
          redirect: { name: 'SchoolAchievementManage' }
        }
        // 成果管理相关路由已移至 /achievement/school
      ]
    },

    // 成果展示相关路由
    {
      path: '/achievement',
      component: () => import('@/views/achievement/AchievementLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/achievement/student'
        },
        {
          path: 'student',
          component: () => import('@/views/achievement/StudentAchievement.vue'),
          meta: { role: ['STUDENT'] }
        },
        {
          path: 'teacher',
          component: () => import('@/views/achievement/TeacherVerifyView.vue'),
          meta: { role: ['TEACHER', 'SCH_ADMIN', 'SCHOOLADMIN'] }
        },
        {
          path: 'enterprise',
          component: () => import('@/views/achievement/EnterpriseAchievementView.vue'),
          meta: { role: ['EN_ADMIN', 'COMPANYADMIN','EN_TEACHER'] }
        },
        {
          path: 'enterprise/portfolio/:id',
          component: () => import('@/views/achievement/PortfolioDetailView.vue'),
          meta: { role: ['EN_ADMIN', 'COMPANYADMIN','EN_TEACHER'] }
        },
        {
          path: 'enterprise/award/:id',
          component: () => import('@/views/achievement/AwardDetailView.vue'),
          meta: { role: ['EN_ADMIN', 'COMPANYADMIN','EN_TEACHER'] }
        },
        {
          path: 'enterprise/research/:id',
          component: () => import('@/views/achievement/ResearchDetailView.vue'),
          meta: { role: ['EN_ADMIN', 'COMPANYADMIN','EN_TEACHER'] }
        },
        {
          path: 'school',
          component: () => import('@/views/achievement/SchoolAchievementManageView.vue'),
          meta: { role: ['SCH_ADMIN', 'SCHOOLADMIN', 'TEACHER'] }
        },
        {
          path: 'admin',
          component: () => import('@/views/achievement/AdminAchievementManageView.vue'),
          meta: { role: ['SYSADMIN', 'ADMIN'] }
        }
      ]
    },
    {
      path: '/achievement/award/:id',
      name: 'award-detail',
      component: AwardDetailView,
      meta: { requiresAuth: true }
    },
    {
      path: '/achievement/portfolio/:id',
      name: 'portfolio-detail',
      component: PortfolioDetailView,
      meta: { requiresAuth: true }
    },
    {
      path: '/achievement/research/:id',
      name: 'research-detail',
      component: ResearchDetailView,
      meta: { requiresAuth: true }
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
      const userInfo = await getMe() as any
      if (userInfo && userInfo.data) {
        appStore.setUser(userInfo.data)
      }
    } catch (e) {
      console.error('获取用户信息失败:', e)
      localStorage.removeItem('token')
      appStore.logout()
      next('/login')
      return
    }
  }
  
  // 需要认证的路由
  if (to.meta.requiresAuth && !appStore.user) {
    next({ 
      name: 'login',
      query: { redirect: to.fullPath }
    })
    return
  }
  
  // 检查角色权限
  if (to.meta.role) {
    const user = appStore.user as any
    if (!user) {
      next('/login')
      return
    }
    
    const requiredRoles = Array.isArray(to.meta.role) ? to.meta.role : [to.meta.role]
    const userRole = user.role.toUpperCase()
    
    if (!requiredRoles.some(role => role.toUpperCase() === userRole)) {
      console.warn(`用户角色 ${userRole} 尝试访问需要 ${requiredRoles.join(',')} 角色的页面`)
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