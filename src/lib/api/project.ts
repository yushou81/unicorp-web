// src/lib/api/project.ts
import { apiRequest } from './apiClient'

// 获取项目列表（分页、搜索）
export function getProjects(params: { page?: number; size?: number; keyword?: string } = {}) {
  const query = new URLSearchParams()
  if (params.page !== undefined) query.append('page', params.page + '')
  if (params.size !== undefined) query.append('size', params.size + '')
  if (params.keyword) query.append('keyword', params.keyword)
  return apiRequest(`/projects?${query.toString()}`)
}

// 创建新项目
export function createProject(data: any) {
  return apiRequest('/projects', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

// 获取项目详情
export function getProject(id: number) {
  return apiRequest(`/projects/${id}`)
}

// 更新项目
export function updateProject(id: number, data: any) {
  return apiRequest(`/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

// 删除项目
export function deleteProject(id: number) {
  return apiRequest(`/projects/${id}`, { method: 'DELETE' })
}

// 学生申请加入项目
export function applyForProject(id: number, data: any = {}) {
  return apiRequest(`/projects/${id}/apply`, {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

// 获取项目申请列表（所有者）
export function getProjectApplications(id: number) {
  return apiRequest(`/projects/${id}/applications`)
}

// 审批项目申请
export function updateApplicationStatus(applicationId: number, data: any) {
  return apiRequest(`/project-applications/${applicationId}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  })
}

// 学生查看我的项目申请
export function getMyApplications(params: { page?: number; size?: number } = {}) {
  const query = new URLSearchParams()
  if (params.page !== undefined) query.append('page', params.page + '')
  if (params.size !== undefined) query.append('size', params.size + '')
  return apiRequest(`/me/project-applications?${query.toString()}`)
}