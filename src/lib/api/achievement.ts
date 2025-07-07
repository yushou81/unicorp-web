import { apiRequest } from './apiClient'

// 基础响应类型
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
  otherUserId: number | null
}

// 分页响应类型
export interface PagedResponse<T> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
}

// 学生成果概览VO
export interface StudentAchievementOverviewVO {
  userId: number
  userName: string
  nickname: string
  avatar: string
  organizationId: number
  organizationName: string
  major: string | null
  educationLevel: string
  portfolioCount: number
  awardCount: number
  researchCount: number
  totalViewCount: number
  totalLikeCount: number
  verifiedCount: number
}

// 竞赛获奖VO
export interface CompetitionAwardVO {
  id: number
  userId: number
  userName: string
  organizationName: string
  competitionName: string
  awardLevel: string
  awardDate: string
  organizer: string | null
  description: string
  certificateUrl: string | null
  teamMembers: string | null
  isVerified: boolean
  verifierId: number | null
  verifierName: string | null
  verifyDate: string | null
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

// 竞赛获奖创建DTO
export interface CreateAwardDTO {
  competitionName: string    // 竞赛名称
  awardName: string         // 奖项名称
  awardDate: string         // 获奖日期
  awardLevel: string        // 获奖级别
  description: string       // 获奖描述
  isPublic: boolean        // 是否公开
  organizationId: number   // 组织ID
}

// 竞赛获奖DTO
export interface AwardDTO {
  competitionName: string    // 竞赛名称
  awardDate: string         // 获奖日期
  awardLevel: string        // 获奖级别
  description: string       // 获奖描述
  isPublic: boolean        // 是否公开
}

// 认证获奖DTO
export interface VerifyAwardDTO {
  isVerified: boolean      // 认证结果
}

// 作品项目VO
export interface PortfolioItemVO {
  id: number
  userId: number
  userName: string
  organizationName: string
  title: string
  description: string
  projectUrl: string | null
  coverImageUrl: string | null
  category: string
  tags: string[]
  teamMembers: string | null
  isPublic: boolean
  viewCount: number
  likeCount: number
  createdAt: string
  updatedAt: string
  resources: any | null  // 如果有具体的资源类型定义可以替换 any
}

// 作品资源VO
export interface PortfolioResourceVO {
  id: number
  resourceName: string
  resourceUrl: string
  resourceType: string
  uploadTime: string
}

// 科研成果VO
export interface ResearchAchievementVO {
  id: number
  title: string
  type: string
  description: string
  publishDate: string
  attachmentUrl?: string
  verifyStatus: string
  comments?: string
  studentId: number
  studentName: string
}

// 基础成果类型
export interface Achievement {
  id: number
  title: string
  type: AchievementType
  studentId: number
  studentName: string
  organizationName: string
  description: string
  verifyStatus: AchievementStatus
  isPublic: boolean
  createdAt: string
  updatedAt: string
  verifierId?: number
  verifierName?: string
  verifyDate?: string
  viewCount?: number
  likeCount?: number
}

// 成果类型枚举
export enum AchievementType {
  PORTFOLIO = 'portfolio',
  AWARD = 'award',
  RESEARCH = 'research'
}

// 成果状态枚举
export enum AchievementStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected'
}

// 科研成果类型
export enum ResearchType {
  PAPER = 'paper',
  PATENT = 'patent',
  BOOK = 'book',
  OTHER = 'other'
}

// 获奖级别
export enum AwardLevel {
  NATIONAL = 'national',
  PROVINCIAL = 'provincial',
  MUNICIPAL = 'municipal',
  SCHOOL = 'school',
  OTHER = 'other'
}

// 审核参数
export interface VerifyDTO {
  status: AchievementStatus
  comment?: string
}

// 学校统计数据
export interface SchoolStatisticsVO {
  totalAchievements: number
  portfolioCount: number
  awardCount: number
  researchCount: number
}

// 学校成果查询参数
export interface SchoolAchievementQuery {
  page: number
  size: number
  type?: string
  verifyStatus?: string
  keyword?: string
}

// 创建作品的请求体类型
export interface CreatePortfolioDTO {
  title: string
  description: string
  projectUrl?: string
  category: string
  tags?: string[]
  teamMembers?: string
  isPublic?: boolean
  coverImage?: File
}

// 更新作品的请求体类型
export interface UpdatePortfolioDTO {
  title?: string
  description?: string
  category?: string
  tags?: string[]
  isPublic?: boolean
  coverUrl?: File  // 封面图片文件
  demoUrl?: string // 项目演示链接
}

// 作品详情的响应类型
export interface PortfolioDetailVO {
  id: number
  userId: number
  userName: string
  organizationName: string
  title: string
  description: string
  projectUrl: string | null
  coverImageUrl: string | null
  category: string
  tags: string[]
  teamMembers: string | null
  isPublic: boolean
  viewCount: number
  likeCount: number
  createdAt: string
  updatedAt: string
  resources: any[] | null
}

// 上传作品资源的请求体类型
export interface UploadPortfolioResourceDTO {
  resourceType: string      // 资源类型（必需）
  file: File               // 资源文件（必需）
  description?: string     // 资源描述（可选）
}

// 成果访问统计的响应类型
export interface AchievementViewsStatisticsVO {
  totalViews: number                // 总访问量
  portfolioViews: number           // 作品访问量
  portfolioViewsPercentage: number // 作品访问占比
  awardViews: number              // 获奖访问量
  awardViewsPercentage: number    // 获奖访问占比
  researchViews: number           // 科研成果访问量
  researchViewsPercentage: number // 科研成果访问占比
}

// 组织成果统计的响应类型
export interface OrganizationStatisticsVO {
  organizationId: number
  organizationName: string
  totalVerifiedAchievements: number  // 已验证的成果总数
  avgPortfoliosPerStudent: number    // 每个学生平均作品数
  avgResearchPerStudent: number      // 每个学生平均科研成果数
  totalResearch: number              // 科研成果总数
  avgAwardsPerStudent: number        // 每个学生平均获奖数
  avgAchievementsPerStudent: number  // 每个学生平均成果数
  totalStudents: number              // 学生总数
  totalPortfolios: number            // 作品总数
  totalAwards: number                // 获奖总数
  totalAchievements: number          // 成果总数
}

// 科研成果创建DTO
export interface CreateResearchDTO {
  title: string           // 标题
  type: string           // 类型
  authors: string        // 作者列表（逗号分隔）
  publicationDate: string // 发布日期
  abstract: string       // 摘要
  description: string    // 描述
  isPublic: boolean      // 是否公开
  coverImage?: File      // 封面图片
  file?: File           // 文件
}

// 科研成果返回VO
export interface ResearchVO {
  id: number
  userId: number
  userName: string
  organizationName: string
  title: string
  type: string
  authors: string
  publicationDate: string
  publisher: string | null
  description: string
  fileUrl: string | null
  coverImageUrl: string | null
  isVerified: boolean
  verifierId: number | null
  verifierName: string | null
  verifyDate: string | null
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

// 认证科研成果DTO
export interface VerifyResearchDTO {
  isVerified: boolean      // 认证结果
}

// 学校成果统计数据类型
export interface SchoolAchievementStatistics {
  totalStudents: number
  totalAchievements: number
  totalVerifiedAchievements: number
  portfolioCount: number
  awardCount: number
  researchCount: number
  avgAchievementsPerStudent: number
  verificationRate: number
  [key: string]: number  // 允许其他统计数据
}

// 成果统计相关接口
export const achievementStatisticsApi = {
  // 获取个人成果概览
  getPersonalOverview() {
    return apiRequest<ApiResponse<StudentAchievementOverviewVO>>('/v1/achievement/statistics/overview')
  },

  // 获取指定学生的成果概览
  getStudentOverview: (userId: number) => {
    return apiRequest<ApiResponse<StudentAchievementOverviewVO>>(`/v1/achievement/statistics/overview/${userId}`)
  },

  // 获取学生成果访问统计
  getViewsStatistics: () => {
    return apiRequest<ApiResponse<AchievementViewsStatisticsVO>>('/v1/achievement/statistics/views')
  },

  // 获取组织成果统计
  getOrganizationStatistics: (organizationId: number) => {
    return apiRequest<ApiResponse<OrganizationStatisticsVO>>(`/v1/achievement/statistics/organization/${organizationId}`)
  },

  // 获取学校学生成果概览列表（分页）
  getSchoolStudentsOverview(params: { page: number; size: number }) {
    const queryParams = new URLSearchParams()
    queryParams.append('page', params.page.toString())
    queryParams.append('size', params.size.toString())
    return apiRequest<ApiResponse<{
      content: StudentAchievementOverviewVO[];
      totalPages: number;
      totalElements: number;
      size: number;
      number: number;
    }>>(`/v1/achievement/statistics/school/students?${queryParams.toString()}`)
  },

  // 获取学校成果优秀学生列表
  getSchoolTopStudents: (limit?: number) => {
    const queryParams = new URLSearchParams()
    if (limit) {
      queryParams.append('limit', limit.toString())
    }
    return apiRequest<ApiResponse<StudentAchievementOverviewVO[]>>(`/v1/achievement/statistics/school/top-students?${queryParams.toString()}`)
  },

  // 获取学校统计数据
  getSchoolStatistics() {
    return apiRequest<ApiResponse<SchoolStatisticsVO>>('/v1/achievement/statistics/school/statistics')
  }
}

// 竞赛获奖相关接口
export const competitionAwardApi = {
  // 获取获奖列表
  getAwards() {
    return apiRequest<ApiResponse<CompetitionAwardVO[]>>('/v1/awards')
  },

  // 分页获取竞赛列表
  getAwardsByPage: (params: { page: number; size: number }) => {
    const queryParams = new URLSearchParams()
    queryParams.append('page', params.page.toString())
    queryParams.append('size', params.size.toString())
    
    return apiRequest<ApiResponse<PagedResponse<CompetitionAwardVO>>>(`/v1/awards/page?${queryParams.toString()}`)
  },

  // 获取公开获奖列表
  getPublicAwards(page: number, size: number) {
    const queryParams = new URLSearchParams()
    queryParams.append('page', page.toString())
    queryParams.append('size', size.toString())
    return apiRequest<ApiResponse<PagedResponse<CompetitionAwardVO>>>(`/v1/awards/public?${queryParams.toString()}`)
  },

  // 获取待认证获奖列表
  getUnverifiedAwards(organizationId: number, page: number, size: number) {
    const queryParams = new URLSearchParams()
    queryParams.append('organizationId', organizationId.toString())
    queryParams.append('page', page.toString())
    queryParams.append('size', size.toString())
    return apiRequest<ApiResponse<PagedResponse<CompetitionAwardVO>>>(`/v1/awards/unverified?${queryParams.toString()}`)
  },

  // 获取获奖详情
  getAwardDetail(id: number) {
    return apiRequest<ApiResponse<CompetitionAwardVO>>(`/v1/awards/${id}`)
  },

  // 创建获奖
  createAward(data: AwardDTO) {
    return apiRequest<ApiResponse<CompetitionAwardVO>>('/v1/awards', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  // 更新获奖
  updateAward(id: number, data: AwardDTO) {
    return apiRequest<ApiResponse<CompetitionAwardVO>>(`/v1/awards/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },

  // 删除获奖
  deleteAward(id: number) {
    return apiRequest<ApiResponse<boolean>>(`/v1/awards/${id}`, {
      method: 'DELETE'
    })
  },

  // 上传获奖证书
  uploadCertificate(id: number, file: File) {
    const formData = new FormData()
    formData.append('file', file)
    return apiRequest<ApiResponse<CompetitionAwardVO>>(`/v1/awards/${id}/certificate`, {
      method: 'POST',
      body: formData
    })
  },

  // 认证获奖
  verifyAward(id: number, data: VerifyAwardDTO) {
    return apiRequest<ApiResponse<CompetitionAwardVO>>(`/v1/awards/${id}/verify`, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }
}

// 作品集相关接口
export const portfolioApi = {
  // 获取作品列表
  getPortfolioItems() {
    return apiRequest<ApiResponse<PortfolioItemVO[]>>('/v1/portfolio/items')
  },

  // 分页获取作品列表
  getPortfolioItemsByPage(page: number, size: number) {
    const queryParams = new URLSearchParams()
    queryParams.append('page', page.toString())
    queryParams.append('size', size.toString())
    return apiRequest<ApiResponse<PagedResponse<PortfolioItemVO>>>(`/v1/portfolio/items/page?${queryParams.toString()}`)
  },

  // 获取公开作品列表
  getPublicPortfolioItems(page: number, size: number) {
    const queryParams = new URLSearchParams()
    queryParams.append('page', page.toString())
    queryParams.append('size', size.toString())
    return apiRequest<ApiResponse<PagedResponse<PortfolioItemVO>>>(`/v1/portfolio/public/items?${queryParams.toString()}`)
  },

  // 根据分类获取公开作品列表
  getPublicPortfolioItemsByCategory(category: string, page: number, size: number) {
    const queryParams = new URLSearchParams()
    queryParams.append('page', page.toString())
    queryParams.append('size', size.toString())
    return apiRequest<ApiResponse<PagedResponse<PortfolioItemVO>>>(`/v1/portfolio/public/items/category/${category}?${queryParams.toString()}`)
  },

  // 获取作品详情
  getPortfolioItemDetail(id: number) {
    return apiRequest<ApiResponse<PortfolioItemVO>>(`/v1/portfolio/items/${id}`)
  },

  // 创建作品
  createPortfolioItem(data: FormData) {
    return apiRequest<ApiResponse<PortfolioItemVO>>('/v1/portfolio/items/create', {
      method: 'POST',
      body: data
    })
  },

  // 更新作品
  updatePortfolioItem(id: number, data: FormData) {
    return apiRequest<ApiResponse<PortfolioItemVO>>(`/v1/portfolio/items/${id}`, {
      method: 'PUT',
      body: data
    })
  },

  // 删除作品
  deletePortfolioItem(id: number) {
    return apiRequest<ApiResponse<boolean>>(`/v1/portfolio/items/${id}`, {
      method: 'DELETE'
    })
  },
  // 上传作品资源
  uploadPortfolioResource(id: number, data: FormData) {
    return apiRequest<ApiResponse<PortfolioResourceVO>>(`/v1/portfolio/items/${id}/resources`, {
      method: 'POST',
      body: data
    })
  },
  // 删除作品资源
  deletePortfolioResource(id: number, resourceId: number) {
    return apiRequest<ApiResponse<void>>(`/v1/portfolio/items/${id}/resources/${resourceId}`, {
      method: 'DELETE'
    })
  },

  // 点赞作品
  likeAchievement(id: number) {
    return apiRequest<ApiResponse<void>>(`/v1/achievements/${id}/like`, {
      method: 'POST'
    })
  },
}

// 科研成果相关接口
export const researchApi = {
  // 获取科研成果列表
  getResearchList() {
    return apiRequest<ApiResponse<ResearchVO[]>>('/v1/research')
  },

  // 创建科研成果
  createResearch(data: CreateResearchDTO) {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        if (value instanceof File) {
          formData.append(key, value)
        } else {
          formData.append(key, value.toString())
        }
      }
    })

    return apiRequest<ApiResponse<ResearchVO>>('/v1/research', {
      method: 'POST',
      body: formData
    })
  },

  // 更新科研成果
  updateResearch(id: number, data: CreateResearchDTO) {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        if (value instanceof File) {
          formData.append(key, value)
        } else {
          formData.append(key, value.toString())
        }
      }
    })

    return apiRequest<ApiResponse<ResearchVO>>(`/v1/research/${id}`, {
      method: 'PUT',
      body: formData
    })
  },

  // 获取科研成果详情
  getResearchById(id: number) {
    return apiRequest<ApiResponse<ResearchVO>>(`/v1/research/${id}`)
  },

  // 删除科研成果
  deleteResearch(id: number) {
    return apiRequest<ApiResponse<null>>(`/v1/research/${id}`, {
      method: 'DELETE'
    })
  },

  // 分页获取科研成果列表
  getResearchByPage(page: number, size: number) {
    const queryParams = new URLSearchParams()
    queryParams.append('page', page.toString())
    queryParams.append('size', size.toString())
    return apiRequest<ApiResponse<PagedResponse<ResearchVO>>>(`/v1/research/page?${queryParams.toString()}`)
  },

  // 获取公开的科研成果列表
  getPublicResearch(page: number, size: number) {
    const queryParams = new URLSearchParams()
    queryParams.append('page', page.toString())
    queryParams.append('size', size.toString())
    return apiRequest<ApiResponse<PagedResponse<ResearchVO>>>(`/v1/research/public?${queryParams.toString()}`)
  },

  // 根据类型获取公开科研成果列表
  getPublicResearchByType(type: string, page: number, size: number) {
    const queryParams = new URLSearchParams()
    queryParams.append('page', page.toString())
    queryParams.append('size', size.toString())
    return apiRequest<ApiResponse<PagedResponse<ResearchVO>>>(`/v1/research/public/type/${type}?${queryParams.toString()}`)
  },

  // 认证科研成果
  verifyResearch(id: number, data: VerifyResearchDTO) {
    return apiRequest<ApiResponse<ResearchVO>>(`/v1/research/${id}/verify`, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  // 获取待认证科研成果列表
  getUnverifiedResearch(organizationId: number, page: number, size: number) {
    const queryParams = new URLSearchParams()
    queryParams.append('organizationId', organizationId.toString())
    queryParams.append('page', page.toString())
    queryParams.append('size', size.toString())
    return apiRequest<ApiResponse<PagedResponse<ResearchVO>>>(`/v1/research/unverified?${queryParams.toString()}`)
  },

  // 上传科研成果文件
  uploadResearchFile(id: number, file: File) {
    const formData = new FormData()
    formData.append('file', file)
    
    return apiRequest<ApiResponse<ResearchVO>>(`/v1/research/${id}/file`, {
      method: 'POST',
      body: formData
    })
  },

  // 上传科研成果封面图片
  uploadResearchCover(id: number, image: File) {
    const formData = new FormData()
    formData.append('file', image)
    
    return apiRequest<ApiResponse<ResearchVO>>(`/v1/research/${id}/cover`, {
      method: 'POST',
      body: formData
    })
  },
  
}