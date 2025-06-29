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
  organization?: {
    id: number
    organizationName: string
    type: string
    description: string
    website: string
    address: string
  }
  enterpriseDetail?: {
    organizationId: number
    industry: string
    companySize: string
    businessLicenseUrl: string
  }
  postedByUserId: number
  postedByUser?: {
    id: number
    account: string
    nickname: string
    email: string
    phone: string
    status: string
    organizationId: number
    organizationName: string | null
    role: string
    createdAt: string
  }
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
  applicationDeadline: string | null
  viewCount: number
  tags: string | null
  logo?: string
  companySize?: string
  industry?: string
  responsibilities?: string // 岗位职责
  requirements?: string // 岗位要求
  benefits?: string // 福利待遇
  jobRequirements?: string // API返回的另一种岗位要求字段
  jobBenefits?: string // API返回的另一种福利待遇字段
  contactPerson?: string // 联系人
  contactEmail?: string // 联系邮箱
  contactPhone?: string // 联系电话
  category?: {
    id: number
    name: string
    parentId: number
    level: number
    children: any | null
  }
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
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : ''
  const url = `/v1/jobs${queryString}`
  console.log(`[getJobs] 请求URL: ${url}, 参数:`, params)
  
  const response = await apiRequest<ApiResponse<PaginatedResponse<Job>>>(url)
  console.log(`[getJobs] 响应数据:`, response.data)
  
  return response
}

/**
 * 获取岗位详情
 * @param id 岗位ID
 * @returns 岗位详情
 */
export async function getJobDetail(id: number | string) {
  const url = `/v1/jobs/${id}`
  console.log(`[getJobDetail] 请求URL: ${url}`)
  
  const response = await apiRequest<ApiResponse<Job>>(url)
  console.log(`[getJobDetail] 响应数据:`, response.data)
  
  return response
}

/**
 * 收藏岗位
 * @param id 岗位ID
 * @returns 收藏结果
 */
export async function favoriteJob(id: number | string) {
  const url = `/v1/jobs/${id}/favorite`
  console.log(`[favoriteJob] 请求URL: ${url}`)
  
  const response = await apiRequest<ApiResponse<any>>(`${url}`, {
    method: 'POST'
  })
  console.log(`[favoriteJob] 响应数据:`, response)
  
  return response
} 