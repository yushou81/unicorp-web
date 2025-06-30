import { apiRequest } from './apiClient'

// 分页响应接口
export interface PaginatedResponse<T> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
}

// 岗位接口
export interface Job {
  id: number
  organizationId: number
  organizationName: string
  postedByUserId: number
  title: string
  description: string
  location: string
  status: string
  createdAt: string
  updatedAt?: string
  salaryMin: number | null
  salaryMax: number | null
  salaryUnit: string | null
  jobType: string
  headcount: number
  educationRequirement: string
  experienceRequirement: string
  jobCategory: string | null
  skillTags: string | null
  applicationDeadline: string | null
  viewCount: number
  logo?: string
  companySize?: string
  industry?: string
}

// API 响应接口
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

// 获取岗位列表参数 - 根据接口文档更新
export interface GetJobsParams {
  page?: number
  size?: number
  keyword?: string
  location?: string
  jobType?: string
  educationRequirement?: string
  salaryMin?: number
  salaryMax?: number
  sortBy?: string
  organizeId?: number
  posterId?: number
}

/**
 * 获取岗位列表
 * @param params 查询参数
 * @returns 岗位列表分页数据
 */
export async function getJobs(params: GetJobsParams = {}) {
  const queryParams = new URLSearchParams()
  
  // 根据接口文档设置参数
  if (params.page !== undefined) {
    queryParams.append('page', params.page.toString())
  }
  
  if (params.size !== undefined) {
    queryParams.append('size', params.size.toString())
  }
  
  if (params.keyword) {
    queryParams.append('keyword', params.keyword)
  }
  
  if (params.location) {
    queryParams.append('location', params.location)
  }
  
  if (params.jobType) {
    queryParams.append('jobType', params.jobType)
  }
  
  if (params.educationRequirement) {
    queryParams.append('educationRequirement', params.educationRequirement)
  }
  
  if (params.salaryMin !== undefined) {
    queryParams.append('salaryMin', params.salaryMin.toString())
  }
  
  if (params.salaryMax !== undefined) {
    queryParams.append('salaryMax', params.salaryMax.toString())
  }
  
  if (params.sortBy) {
    queryParams.append('sortBy', params.sortBy)
  }
  
  if (params.organizeId !== undefined) {
    queryParams.append('organizeId', params.organizeId.toString())
  }
  
  if (params.posterId !== undefined) {
    queryParams.append('posterId', params.posterId.toString())
  }
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : ''
  const url = `/v1/jobs${queryString}`
  console.log(`[getJobs] 请求URL: ${url}, 参数:`, params)
  
  const response = await apiRequest<ApiResponse<PaginatedResponse<Job>>>(url)
  console.log(`[getJobs] 响应数据:`, response.data)
  
  return response
} 