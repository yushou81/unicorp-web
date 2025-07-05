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
import { getMe } from '@/lib/api/auth'
import { useAppStore } from '@/stores/app'

// 添加成果展示相关的组件导入
import AchievementOverview from '@/views/achievement/StudentAchievement.vue'
import TeacherVerifyView from '@/views/achievement/TeacherVerifyView.vue'
import EnterpriseAchievementView from '@/views/achievement/EnterpriseAchievementView.vue'
import SchoolAchievementManageView from '@/views/achievement/SchoolAchievementManageView.vue'
import SchoolAchievementDetailView from '@/views/achievement/SchoolAchievementDetailView.vue'

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
            return { name: 'company-dashboard' }
          case 'TEACHER':
            return { name: 'teacher-dashboard' }
          case 'SYSADMIN':
          case 'ADMIN':
            return { name: 'admin-dashboard' }
          case 'MENTOR':
          case 'EN_TEACHER':
            return { name: 'mentor-dashboard' } // 添加企业导师路由
          case 'SCH_ADMIN':
          case 'SCHOOLADMIN':
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
    // {
    //   path: '/project/list',
    //   name: 'project-list',
    //   component: () => import('@/views/project/ProjectListView.vue')
    // },
    {
      path: '/project/publish',
      name: 'project-publish',
      component: () => import('@/views/project/ProjectPublishView.vue')
    },
    {
      path: '/project/:id/apply',
      name: 'ProjectApply',
      component: () => import('@/views/project/ProjectApplyView.vue')
    },
    {
      path: '/project/:id/members',
      name: 'ProjectMemberManage',
      component: () => import('@/views/project/ProjectMemberManageView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/project/:id/fund',
      name: 'project-fund',
      component: () => import('@/views/project/ProjectFundView.vue')
    },
    // {
    //   path: '/project/:id',
    //   name: 'project-detail',
    //   component: () => import('@/views/project/ProjectDetailView.vue')
    // },
    {
      path: '/student/projects',
      name: 'StudentProjectSearch',
      component: () => import('@/views/project/StudentProjectSearchView.vue'),
      meta: { requiresAuth: true, role: 'student' }
    },
    // 在现有路由配置中添加
    {
      path: '/project/edit/:id',
      name: 'ProjectEdit',
      component: () => import('@/views/project/ProjectEditView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/company/projects',
      name: 'CompanyProjectManage',
      component: () => import('@/views/project/CompanyProjectManageView.vue'),
      meta: { requiresAuth: true, role: 'companyAdmin' }
    },
    {
      path: '/teacher/projects',
      name: 'TeacherProjectManage',
      component: () => import('@/views/project/TeacherProjectManageView.vue'),
      meta: { requiresAuth: true, role: 'teacher' }
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
      children: [
        {
          path: '',
          redirect: '/achievement/student'
        },
        {
          path: 'student',
          component: () => import('@/views/achievement/StudentAchievement.vue')
        },
        {
          path: 'teacher',
          component: () => import('@/views/achievement/TeacherVerifyView.vue')
        },
        {
          path: 'enterprise',
          component: () => import('@/views/achievement/EnterpriseAchievementView.vue')
        },
        {
          path: 'enterprise/:id',
          component: () => import('@/views/achievement/EnterpriseAchievementDetailView.vue')
        },
        {
          path: 'school',
          component: () => import('@/views/achievement/SchoolAchievementManageView.vue')
        },
        {
          path: 'admin',
          component: () => import('@/views/achievement/AdminAchievementManageView.vue')
          // meta: { requiresAuth: true, role: ['SYSADMIN', 'admin', 'ADMIN'] }
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
      // 不需要setToken，因为axios请求拦截器会自动添加token
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
  
  if (to.meta.requiresAuth && !appStore.user) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router 