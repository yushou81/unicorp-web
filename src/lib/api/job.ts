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

// 岗位申请接口
export interface JobApplication {
  id: number
  jobId: number
  jobTitle: string
  companyName: string
  status: string
  appliedAt: string
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

// 岗位创建DTO
export interface JobCreationDTO {
  title: string
  description: string
  location: string
  jobType: string
  educationRequirement: string
  salaryMin?: number
  salaryMax?: number
  salaryUnit?: string
  headcount?: number
  experienceRequirement?: string
  applicationDeadline?: string
  skillTags?: string
  categoryId: number // 三级分类ID
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

/**
 * 取消收藏岗位
 * @param id 岗位ID
 * @returns 取消收藏结果
 */
export async function unfavoriteJob(id: number | string) {
  const url = `/v1/jobs/${id}/favorite`
  console.log(`[unfavoriteJob] 请求URL: ${url}`)
  
  const response = await apiRequest<ApiResponse<any>>(`${url}`, {
    method: 'DELETE'
  })
  console.log(`[unfavoriteJob] 响应数据:`, response)
  
  return response
}

/**
 * 获取我收藏的岗位列表
 * @param params 分页参数
 * @returns 收藏岗位列表
 */
export async function getFavoriteJobs(params: { page?: number, size?: number } = {}) {
  const queryParams = new URLSearchParams()
  
  if (params.page !== undefined) {
    queryParams.append('page', params.page.toString())
  }
  
  if (params.size !== undefined) {
    queryParams.append('size', params.size.toString())
  }
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : ''
  const url = `/v1/me/favorites/jobs${queryString}`
  console.log(`[getFavoriteJobs] 请求URL: ${url}`)
  
  const response = await apiRequest<ApiResponse<PaginatedResponse<Job>>>(url)
  console.log(`[getFavoriteJobs] 响应数据:`, response.data)
  
  return response
}

/**
 * 获取我的岗位申请列表
 * @param params 分页参数
 * @returns 申请列表
 */
export async function getMyApplications(params: { page?: number, size?: number } = {}) {
  const queryParams = new URLSearchParams()
  
  if (params.page !== undefined) {
    queryParams.append('page', params.page.toString())
  }
  
  if (params.size !== undefined) {
    queryParams.append('size', params.size.toString())
  }
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : ''
  const url = `/v1/me/applications${queryString}`
  console.log(`[getMyApplications] 请求URL: ${url}`)
  
  const response = await apiRequest<ApiResponse<PaginatedResponse<JobApplication>>>(url)
  console.log(`[getMyApplications] 响应数据:`, response.data)
  
  return response
}

/**
 * 申请岗位 - 上传简历文件
 * @param jobId 岗位ID
 * @param formData 包含简历文件和其他信息的FormData对象
 * @returns 申请结果
 */
export async function applyJobWithFile(jobId: number | string, formData: FormData) {
  const url = `/v1/jobs/${jobId}/apply/file`
  console.log(`[applyJobWithFile] 请求URL: ${url}`)
  
  const response = await apiRequest<ApiResponse<any>>(`${url}`, {
    method: 'POST',
    body: formData,
    // 使用FormData时不要设置Content-Type，浏览器会自动设置
    headers: {}
  })
  console.log(`[applyJobWithFile] 响应数据:`, response)
  
  return response
}

/**
 * 申请岗位 - 在线填写简历
 * @param jobId 岗位ID
 * @param resumeData 简历数据
 * @returns 申请结果
 */
export async function applyJobWithOnlineResume(jobId: number | string, resumeData: any) {
  const url = `/v1/jobs/${jobId}/apply/online`
  console.log(`[applyJobWithOnlineResume] 请求URL: ${url}`)
  
  const response = await apiRequest<ApiResponse<any>>(`${url}`, {
    method: 'POST',
    body: JSON.stringify(resumeData)
  })
  console.log(`[applyJobWithOnlineResume] 响应数据:`, response)
  
  return response
}

/**
 * 检查用户是否已有简历
 * @returns 检查结果
 */
export async function checkUserResume() {
  const url = `/v1/resume/check`
  console.log(`[checkUserResume] 请求URL: ${url}`)
  
  const response = await apiRequest<ApiResponse<{hasResume: boolean}>>(`${url}`)
  console.log(`[checkUserResume] 响应数据:`, response)
  
  return response
}

/**
 * 申请岗位
 * @param jobId 岗位ID
 * @returns 申请结果
 */
export async function applyJob(jobId: number | string) {
  const url = `/v1/jobs/${jobId}/apply`
  console.log(`[applyJob] 请求URL: ${url}`)
  
  const response = await apiRequest<ApiResponse<number>>(`${url}`, {
    method: 'POST'
  })
  console.log(`[applyJob] 响应数据:`, response)
  
  return response
}

/**
 * 创建新岗位
 * @param data 岗位创建数据
 * @returns 创建结果
 */
export async function createJob(data: JobCreationDTO) {
  const url = '/v1/jobs'
  const response = await apiRequest<ApiResponse<any>>(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return response
}

/**
 * 更新申请状态
 * @param applicationId 申请ID
 * @param statusData 状态更新数据
 * @returns 更新结果
 */
export async function updateApplicationStatus(applicationId: number, statusData: { status: string, feedback?: string }) {
  const url = `/v1/applications/${applicationId}`
  console.log(`[updateApplicationStatus] 请求URL: ${url}`)
  
  const response = await apiRequest<ApiResponse<any>>(`${url}`, {
    method: 'PATCH',
    body: JSON.stringify(statusData)
  })
  console.log(`[updateApplicationStatus] 响应数据:`, response)
  
  return response
}

/**
 * 更新岗位信息
 * @param id 岗位ID
 * @param data 岗位数据
 * @returns 更新结果
 */
export async function updateJob(id: number | string, data: JobCreationDTO) {
  const url = `/v1/jobs/${id}`
  const response = await apiRequest<ApiResponse<any>>(url, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return response
}

/**
 * 删除岗位
 * @param id 岗位ID
 * @returns 删除结果
 */
export async function deleteJob(id: number | string) {
  const url = `/v1/jobs/${id}`
  const response = await apiRequest<ApiResponse<any>>(url, {
    method: 'DELETE'
  })
  return response
}

/**
 * 获取所有岗位分类（公开接口）
 * @param params 分页参数
 * @returns 分类列表
 */
export async function getPublicJobCategories(params?: { page?: number; size?: number }) {
  const query = new URLSearchParams()
  if (params?.page) query.append('page', params.page.toString())
  if (params?.size) query.append('size', params.size.toString())
  const url = query.toString() ? `/v1/job-categories?${query}` : '/v1/job-categories'
  return apiRequest(url)
}

/**
 * 获取岗位申请列表（企业）
 * @param jobId 岗位ID
 * @param page 页码
 * @param size 每页数量
 * @returns 申请人分页数据
 */
export async function getJobApplications(jobId: number | string, page = 1, size = 10) {
  const url = `/v1/jobs/${jobId}/applications?page=${page}&size=${size}`
  return apiRequest(url)
} 