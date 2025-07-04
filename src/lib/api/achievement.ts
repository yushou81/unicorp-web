import { apiRequest } from './apiClient'

// 定义API响应类型
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

// 定义分页响应类型
export interface PagedResponse<T> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
}

// 学生成果概览VO
export interface StudentAchievementOverviewVO {
  totalAchievements: number
  verifiedAchievements: number
  pendingAchievements: number
  rejectedAchievements: number
  portfolioCount: number
  awardCount: number
  researchCount: number
}

// 竞赛获奖VO
export interface CompetitionAwardVO {
  id: number
  title: string
  competition: string
  level: string
  rank: string
  awardDate: string
  certificateUrl?: string
  verifyStatus: string
  comments?: string
  studentId: number
  studentName: string
  organizationId: number
  organizationName: string
}

// 竞赛获奖创建DTO
export interface CompetitionAwardCreationDTO {
  title: string
  competition: string
  level: string
  rank: string
  awardDate: string
  certificateUrl?: string
}

// 作品项目VO
export interface PortfolioItemVO {
  id: number
  title: string
  description: string
  category: string
  coverUrl: string
  createdAt: string
  updatedAt: string
  verifyStatus: string
  comments?: string
  studentId: number
  studentName: string
}

// 作品资源VO
export interface PortfolioResourceVO {
  id: number
  portfolioId: number
  resourceName: string
  resourceUrl: string
  resourceType: string
  uploadTime: string
}

// 成果类型
export enum AchievementType {
  PORTFOLIO = 'portfolio',
  AWARD = 'award',
  RESEARCH = 'research'
}

// 成果状态
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

// 成果查询参数
interface AchievementQuery {
  page?: number
  size?: number
  type?: string
  status?: string
  keyword?: string
  userId?: number
}

// 基础成果类型
export interface Achievement {
  id: number
  title: string
  type: 'portfolio' | 'award' | 'research'
  studentId: number
  studentName: string
  verifyStatus: 'pending' | 'verified' | 'rejected'
  createdAt: string
  updatedAt: string
}

/**
 * 学校管理员相关接口
 */
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

// 成果审核参数
export interface VerifyAchievementDTO {
  status: 'verified' | 'rejected'
  comment: string
}

// 学校管理员相关接口
export const achievementApi = {
  // 获取成果概览
  getOverview: () => {
    return apiRequest('/v1/achievement/statistics/overview')
  },
  
  // 获取统计数据
  getStatistics: () => {
    return apiRequest('/v1/achievement/statistics')
  },
  
  // 企业端获取成果列表（只返回已认证的成果）
  getVerifiedEnterpriseList: (params: any) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.size) queryParams.append('size', params.size.toString());
    if (params.type) queryParams.append('type', params.type);
    if (params.school) queryParams.append('school', params.school);
    if (params.major) queryParams.append('major', params.major);
    if (params.educationLevel) queryParams.append('educationLevel', params.educationLevel);
    if (params.keyword) queryParams.append('keyword', params.keyword);
    // 强制只获取已认证的成果
    queryParams.append('isVerified', 'true');
    
    return apiRequest(`/v1/enterprise/achievements/verified?${queryParams.toString()}`)
  },

  // 获取学校成果统计
  getSchoolStatistics() {
    return apiRequest<ApiResponse<SchoolStatisticsVO>>('/v1/school/achievements/statistics')
  },

  // 获取学校成果列表
  getSchoolAchievements(params: SchoolAchievementQuery) {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value.toString())
    })
    return apiRequest<ApiResponse<PagedResponse<Achievement>>>(`/v1/school/achievements?${queryParams.toString()}`)
  },

  // 审核成果
  verifyAchievement(id: number, data: VerifyAchievementDTO) {
    return apiRequest<ApiResponse<void>>(`/v1/school/achievements/${id}/verify`, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  // 获取学校选项
  getSchoolOptions() {
    return apiRequest('/v1/common/schools')
  },

  // 获取专业选项
  getMajorOptions() {
    return apiRequest('/v1/common/majors')
  },
  
  // 获取企业视角的统计数据
  getEnterpriseStatistics: () => {
    return apiRequest('/v1/enterprise/achievements/statistics')
  },
  
  // 企业用户收藏成果
  favoriteAchievement: (achievementId: number | string) => {
    return apiRequest(`/v1/enterprise/achievements/${achievementId}/favorite`, {
      method: 'POST'
    })
  },
  
  // 企业用户取消收藏成果
  unfavoriteAchievement: (achievementId: number | string) => {
    return apiRequest(`/v1/enterprise/achievements/${achievementId}/favorite`, {
      method: 'DELETE'
    })
  },
  
  // 获取企业用户的收藏列表
  getFavorites: (page: number, size: number) => {
    return apiRequest(`/v1/enterprise/achievements/favorites?page=${page}&size=${size}`)
  },
  
  // 检查成果是否已收藏
  checkFavoriteStatus: (achievementId: number | string) => {
    return apiRequest(`/v1/enterprise/achievements/${achievementId}/favorite/status`)
  },
  
  // 评价成果
  rateAchievement: (achievementId: number | string, data: { rating: number, comment: string }) => {
    return apiRequest(`/v1/enterprise/achievements/${achievementId}/rate`, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },
  
  // 获取学生能力标签
  getStudentSkills: (studentId: number | string) => {
    return apiRequest(`/v1/enterprise/students/${studentId}/skills`)
  },
  
  // 获取成果列表
  getList: (params: AchievementQuery) => {
    const queryParams = new URLSearchParams()
    if (params.page) queryParams.append('page', params.page.toString())
    if (params.size) queryParams.append('size', params.size.toString())
    if (params.type) queryParams.append('type', params.type)
    if (params.status) queryParams.append('status', params.status)
    if (params.keyword) queryParams.append('keyword', params.keyword)
    if (params.userId) queryParams.append('userId', params.userId.toString())
    
    return apiRequest(`/v1/achievement/list?${queryParams.toString()}`)
  },
  
  // 获取成果详情
  getDetail: (id: number | string) => {
    return apiRequest(`/v1/achievement/${id}`)
  },
  
  // 创建成果
  create: (data: any) => {
    return apiRequest('/v1/achievement', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },
  
  // 更新成果
  update: (id: number | string, data: any) => {
    return apiRequest(`/v1/achievement/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },
  
  // 删除成果
  delete: (id: number | string) => {
    return apiRequest(`/v1/achievement/${id}`, {
      method: 'DELETE'
    })
  },
  
  // 获取作品列表
  getPortfolios: (params: AchievementQuery) => {
    const queryParams = new URLSearchParams()
    if (params.page) queryParams.append('page', params.page.toString())
    if (params.size) queryParams.append('size', params.size.toString())
    if (params.status) queryParams.append('status', params.status)
    if (params.keyword) queryParams.append('keyword', params.keyword)
    if (params.userId) queryParams.append('userId', params.userId.toString())
    
    return apiRequest(`/v1/achievement/portfolios?${queryParams.toString()}`)
  },
  
  // 获取获奖列表
  getAwards: (params: AchievementQuery) => {
    const queryParams = new URLSearchParams()
    if (params.page) queryParams.append('page', params.page.toString())
    if (params.size) queryParams.append('size', params.size.toString())
    if (params.status) queryParams.append('status', params.status)
    if (params.keyword) queryParams.append('keyword', params.keyword)
    if (params.userId) queryParams.append('userId', params.userId.toString())
    
    return apiRequest(`/v1/achievement/awards?${queryParams.toString()}`)
  },
  
  // 获取科研成果列表
  getResearch: (params: AchievementQuery) => {
    const queryParams = new URLSearchParams()
    if (params.page) queryParams.append('page', params.page.toString())
    if (params.size) queryParams.append('size', params.size.toString())
    if (params.status) queryParams.append('status', params.status)
    if (params.keyword) queryParams.append('keyword', params.keyword)
    if (params.userId) queryParams.append('userId', params.userId.toString())
    
    return apiRequest(`/v1/achievement/research?${queryParams.toString()}`)
  }
}

// 成果统计相关接口
export const achievementStatisticsApi = {
  // 获取个人成果概览
  getPersonalOverview() {
    return apiRequest<ApiResponse<StudentAchievementOverviewVO>>('/v1/achievement/statistics/overview')
  },

  // 获取指定学生成果概览
  getStudentOverview(userId: number) {
    return apiRequest<ApiResponse<StudentAchievementOverviewVO>>(`/v1/achievement/statistics/overview/${userId}`)
  },

  // 获取访问统计
  getViewsStatistics() {
    return apiRequest<ApiResponse<{
      dailyViews: Record<string, number>
      achievementViews: Record<string, number>
    }>>('/v1/achievement/statistics/views')
  },

  // 获取组织成果统计
  getOrganizationStatistics(organizationId: number) {
    return apiRequest<ApiResponse<{
      totalStudents: number
      totalAchievements: number
      verifiedAchievements: number
    }>>(`/v1/achievement/statistics/organization/${organizationId}`)
  }
}

// 竞赛获奖相关接口
export const competitionAwardApi = {
  // 获取获奖列表
  getAwards() {
    return apiRequest<ApiResponse<CompetitionAwardVO[]>>('/v1/awards')
  },

  // 分页获取获奖列表
  getAwardsByPage(page: number, size: number) {
    return apiRequest<ApiResponse<PagedResponse<CompetitionAwardVO>>>(`/v1/awards/page?page=${page}&size=${size}`)
  },

  // 获取公开获奖列表
  getPublicAwards(page: number, size: number) {
    return apiRequest<ApiResponse<PagedResponse<CompetitionAwardVO>>>(`/v1/awards/public?page=${page}&size=${size}`)
  },

  // 获取待认证获奖列表
  getUnverifiedAwards(organizationId: number, page: number, size: number) {
    return apiRequest<ApiResponse<PagedResponse<CompetitionAwardVO>>>(`/v1/awards/unverified?organizationId=${organizationId}&page=${page}&size=${size}`)
  },

  // 获取获奖详情
  getAwardDetail(id: number) {
    return apiRequest<ApiResponse<CompetitionAwardVO>>(`/v1/awards/${id}`)
  },

  // 创建获奖
  createAward(data: CompetitionAwardCreationDTO) {
    return apiRequest<ApiResponse<CompetitionAwardVO>>('/v1/awards', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  // 更新获奖
  updateAward(id: number, data: CompetitionAwardCreationDTO) {
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
  verifyAward(id: number, data: { verifyResult: boolean; comments: string }) {
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
    return apiRequest<ApiResponse<PagedResponse<PortfolioItemVO>>>(`/v1/portfolio/items/page?page=${page}&size=${size}`)
  },

  // 获取公开作品列表
  getPublicPortfolioItems(page: number, size: number) {
    return apiRequest<ApiResponse<PagedResponse<PortfolioItemVO>>>(`/v1/portfolio/public/items?page=${page}&size=${size}`)
  },

  // 根据分类获取公开作品列表
  getPublicPortfolioItemsByCategory(category: string, page: number, size: number) {
    return apiRequest<ApiResponse<PagedResponse<PortfolioItemVO>>>(`/v1/portfolio/public/items/category/${category}?page=${page}&size=${size}`)
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

  // 获取作品资源列表
  getPortfolioResources(id: number) {
    return apiRequest<ApiResponse<PortfolioResourceVO[]>>(`/v1/portfolio/items/${id}/resources`)
  },

  // 上传作品资源
  uploadPortfolioResource(id: number, data: FormData) {
    return apiRequest<ApiResponse<PortfolioResourceVO>>(`/v1/portfolio/items/${id}/resources`, {
      method: 'POST',
      body: data
    })
  }
}