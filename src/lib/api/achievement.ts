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
  },

  // 删除作品资源
  deletePortfolioResource(resourceId: number) {
    return apiRequest<ApiResponse<boolean>>(`/v1/portfolio/resources/${resourceId}`, {
      method: 'DELETE'
    })
  }
}

// 科研成果相关接口
export const researchAchievementApi = {
  // 获取科研成果列表
  getResearchAchievements() {
    return apiRequest<ApiResponse<ResearchAchievementVO[]>>('/v1/research/achievements')
  },

  // 分页获取科研成果列表
  getResearchAchievementsByPage(page: number, size: number) {
    return apiRequest<ApiResponse<PagedResponse<ResearchAchievementVO>>>(`/v1/research/achievements/page?page=${page}&size=${size}`)
  },

  // 获取公开科研成果列表
  getPublicResearchAchievements(page: number, size: number) {
    return apiRequest<ApiResponse<PagedResponse<ResearchAchievementVO>>>(`/v1/research/achievements/public?page=${page}&size=${size}`)
  },

  // 获取待认证科研成果列表
  getUnverifiedResearchAchievements(organizationId: number, page: number, size: number) {
    return apiRequest<ApiResponse<PagedResponse<ResearchAchievementVO>>>(`/v1/research/achievements/unverified?organizationId=${organizationId}&page=${page}&size=${size}`)
  },

  // 获取科研成果详情
  getResearchAchievementDetail(id: number) {
    return apiRequest<ApiResponse<ResearchAchievementVO>>(`/v1/research/achievements/${id}`)
  },

  // 创建科研成果
  createResearchAchievement(data: FormData) {
    return apiRequest<ApiResponse<ResearchAchievementVO>>('/v1/research/achievements', {
      method: 'POST',
      body: data
    })
  },

  // 更新科研成果
  updateResearchAchievement(id: number, data: FormData) {
    return apiRequest<ApiResponse<ResearchAchievementVO>>(`/v1/research/achievements/${id}`, {
      method: 'PUT',
      body: data
    })
  },

  // 删除科研成果
  deleteResearchAchievement(id: number) {
    return apiRequest<ApiResponse<boolean>>(`/v1/research/achievements/${id}`, {
      method: 'DELETE'
    })
  },

  // 认证科研成果
  verifyResearchAchievement(id: number, data: { verifyResult: boolean; comments: string }) {
    return apiRequest<ApiResponse<ResearchAchievementVO>>(`/v1/research/achievements/${id}/verify`, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }
}

// 类型定义
export interface StudentAchievementOverviewVO {
  userId: number
  username: string
  totalAchievements: number
  verifiedAchievements: number
  competitionAwards: number
  researchAchievements: number
  portfolioItems: number
  totalViews: number
}

export interface CompetitionAwardVO {
  id: number
  userId: number
  username: string
  competitionName: string
  awardName: string
  awardDate: string
  organizer: string
  level: string
  participants: string
  certificateUrl: string
  description: string
  isPublic: boolean
  isVerified: boolean
  verifiedBy: number
  verifierName: string
  verifiedTime: string
  verificationComments: string
  viewCount: number
}

export interface CompetitionAwardCreationDTO {
  competitionName: string
  awardName: string
  awardDate: string
  organizer: string
  level: string
  participants: string
  description: string
  isPublic: boolean
}

export interface PortfolioItemVO {
  id: number
  userId: number
  username: string
  title: string
  description: string
  projectUrl: string
  coverImageUrl: string
  category: string
  tags: string[]
  teamMembers: string
  isPublic: boolean
  viewCount: number
  likeCount: number
  resources: PortfolioResourceVO[]
}

export interface PortfolioResourceVO {
  id: number
  portfolioItemId: number
  resourceType: string
  resourceUrl: string
  originalFileName: string
  description: string
}

export interface ResearchAchievementVO {
  id: number
  userId: number
  username: string
  title: string
  type: string
  authors: string
  publicationDate: string
  publisher: string
  description: string
  fileUrl: string
  coverImageUrl: string
  isPublic: boolean
  isVerified: boolean
  verifiedBy: number
  verifierName: string
  verifiedTime: string
  verificationComments: string
  viewCount: number
} 