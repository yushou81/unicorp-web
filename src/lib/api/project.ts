// src/lib/api/project.ts
import { apiRequest } from './apiClient'
import qs from 'qs'

export interface Project {
  id: number
  title: string
  organizationName?: string
  projectProposalUrl?: string
  planUrl?: string
  planMemberCount?: number
  maxMemberCount?: number
  memberCount?: number
  applicationStatus?: 'submitted' | 'approved' | 'rejected' // 新增，类型更明确
  // 其他字段按需补充
  // 其他字段按需补充
}
export interface ProjectListResponse {
  records: Project[]
  total: number
  current: number
}

export interface ProjectMember {
  userId: number
  realName?: string
  nickname?: string
  joinedAt?: string
  createdAt?: string
  reason?: string
  // 其他字段按需补充
}

export interface ProjectApplication {
  id: number
  status: string
  applicantProfile?: {
    realName?: string
    nickname?: string
    userId?: number
  }
  createdAt?: string
  applicationStatement?: string
  // 其他字段...
}
export interface ProjectDetail {
  title: string
  planMemberCount?: number
  description?: string
  difficulty?: string
  supportLanguages?: string[] | string
  techFields?: string[]
  programmingLanguages?: string[]
  projectProposalUrl?: string
  // 其他字段按需补充
}

// 获取项目列表（分页、搜索、筛选）
export function getProjects(params: any = {}): Promise<{ data: ProjectListResponse }> {
  const query = qs.stringify(params, { arrayFormat: 'repeat' })
  return apiRequest(`/v1/projects?${query}`)
}

export interface MyApplication {
  // 按实际后端返回字段补充
  memberCount?: number
  planMemberCount?: number | string
  organizationName?: string
  // 其他字段...
}
export interface MyApplicationsResponse {
  records: MyApplication[]
  total: number
  current: number
}

// 创建新项目
export function createProject(data: any) {
  return apiRequest('/v1/projects', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

// 获取项目详情
export function getProject(id: number): Promise<{ data: ProjectDetail }> {
  return apiRequest(`/v1/projects/${id}`)
}

// 更新项目
export function updateProject(id: number, data: any) {
  return apiRequest(`/v1/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

// 删除项目
export function deleteProject(id: number) {
  return apiRequest(`/v1/projects/${id}`, { method: 'DELETE' })
}

// 学生申请加入项目
export function applyForProject(id: number, data: any = {}) {
  return apiRequest(`/v1/projects/${id}/apply`, {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

// 获取已加入成员
export function getProjectMembers(projectId: number): Promise<{ data: ProjectMember[] }> {
  return apiRequest(`/v1/projects/${projectId}/members`, { method: 'GET' })
}


// 获取项目申请列表（所有者）
export function getProjectApplications(id: number): Promise<{ data: ProjectApplication[] }> {
  return apiRequest(`/v1/projects/${id}/applications`)
}

// 审批项目申请
export function updateApplicationStatus(applicationId: number, data: any) {
  return apiRequest(`/v1/project-applications/${applicationId}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  })
}

// 学生查看我的项目申请
export function getMyApplications(params: { page?: number; size?: number } = {}): Promise<{ data: MyApplicationsResponse }> {
  const query = new URLSearchParams()
  if (params.page !== undefined) query.append('page', params.page + '')
  if (params.size !== undefined) query.append('size', params.size + '')
  return apiRequest(`/v1/me/project-applications?${query.toString()}`)
}

/**
 * 移除项目成员
 * @param memberId 成员ID
 */
export function removeProjectMember(userId: number, projectId: number) {
    return apiRequest(`/v1/projects/${projectId}/member/${userId}`, { method: 'DELETE' })
  }