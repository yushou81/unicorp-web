import { apiRequest } from './apiClient'

// 管理员录入学校
export function adminCreateSchool(data: {
  organization_name: string
  description?: string
  address?: string
  website?: string
  admin_email: string
  admin_nickname?: string
  admin_password: string
}) {
  return apiRequest('/v1/admin/organizations/schools', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

// 获取待审核组织列表
export function getPendingOrganizations() {
  return apiRequest('/v1/admin/approvals/organizations')
}

// 审核通过组织
export function approveOrganization(id: number) {
  return apiRequest(`/v1/admin/approvals/organizations/${id}/approve`, {
    method: 'PATCH'
  })
}

// 手动创建学校信息
export function createSchool(data: {
  organizationName: string
  description?: string
  address?: string
  website?: string
  adminNickname?: string
  adminPassword: string
  adminEmail: string
}) {
  return apiRequest('/v1/admin/schools', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

// 获取待审核企业注册列表
export function getPendingEnterprises() {
  return apiRequest('/v1/admin/approvals/organizations')
}

// [Admin]批准企业注册
export function approveEnterprise(id: number) {
  return apiRequest(`/v1/admin/enterprises/${id}/approve`, {
    method: 'PUT'
  })
}

// 获取所有学校列表
export function getAllSchools(page?: number, size?: number) {
  const params = new URLSearchParams()
  if (page !== undefined) params.append('page', page.toString())
  if (size !== undefined) params.append('size', size.toString())
  
  const queryString = params.toString()
  const url = queryString ? `/v1/admin/schools?${queryString}` : '/v1/admin/schools'
  
  return apiRequest(url, {
    method: 'GET'
  })
}

// 获取所有企业列表
export function getAllEnterprises(page?: number, size?: number) {
  const params = new URLSearchParams()
  if (page !== undefined) params.append('page', page.toString())
  if (size !== undefined) params.append('size', size.toString())
  
  const queryString = params.toString()
  const url = queryString ? `/v1/admin/enterprises?${queryString}` : '/v1/admin/enterprises'
  
  return apiRequest(url, {
    method: 'GET'
  })
}

// 修改用户基本信息
export function updateUser(id: number, data: {
  nickname?: string
  email?: string
  phone?: string
}) {
  return apiRequest(`/v1/admin/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

// 获取用户列表
export function getUsers(params?: {
  page?: number
  size?: number
  role?: string
}) {
  const queryParams = new URLSearchParams()
  if (params?.page !== undefined) queryParams.append('page', params.page.toString())
  if (params?.size !== undefined) queryParams.append('size', params.size.toString())
  if (params?.role) queryParams.append('role', params.role)
  
  const queryString = queryParams.toString()
  const url = queryString ? `/v1/admin/users?${queryString}` : '/v1/admin/users'
  
  return apiRequest(url, {
    method: 'GET'
  })
} 
// 修改用户状态（激活/禁用）
export function updateUserStatus(id: number, status: 'active' | 'inactive') {
  return apiRequest(`/v1/admin/users/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  })
}

// 岗位分类管理相关API
// 获取岗位分类列表
export function getJobCategories(params?: {
  page?: number
  size?: number
  name?: string
}) {
  const queryParams = new URLSearchParams()
  if (params?.page !== undefined) queryParams.append('page', params.page.toString())
  if (params?.size !== undefined) queryParams.append('size', params.size.toString())
  if (params?.name) queryParams.append('name', params.name)
  
  const queryString = queryParams.toString()
  const url = queryString ? `/v1/admin/job-categories?${queryString}` : '/v1/admin/job-categories'
  
  return apiRequest(url, {
    method: 'GET'
  })
}

// 获取根分类（顶级分类）
export function getRootJobCategories() {
  return apiRequest('/v1/job-categories/root', {
    method: 'GET'
  })
}

// 获取指定分类的子分类
export function getJobCategoryChildren(id: number) {
  return apiRequest(`/v1/job-categories/${id}/children`, {
    method: 'GET'
  })
}

// 创建岗位分类
export function createJobCategory(data: {
  name: string
  parentId?: number
}) {
  const requestData: any = {
    name: data.name
  }
  if (data.parentId !== undefined && data.parentId !== null) {
    requestData.parentId = data.parentId
  }
  return apiRequest('/v1/admin/job-categories', {
    method: 'POST',
    body: JSON.stringify(requestData)
  })
}

// 更新岗位分类
export function updateJobCategory(id: number, data: {
  name?: string
}) {
  const requestData: any = {}
  if (data.name !== undefined) requestData.name = data.name
  // 不再传 parentId
  return apiRequest(`/v1/admin/job-categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(requestData)
  })
}

// 删除岗位分类
export function deleteJobCategory(id: number) {
  return apiRequest(`/v1/admin/job-categories/${id}`, {
    method: 'DELETE'
  })
}

// 获取岗位分类详情
export function getJobCategoryDetail(id: number) {
  return apiRequest(`/v1/admin/job-categories/${id}`, {
    method: 'GET'
  })
}

/**
 * 获取所有岗位分类（树形结构）
 */
export function getHierarchicalJobCategories() {
  return apiRequest('/v1/job-categories/hierarchical', {
    method: 'GET'
  })
}

// 审计日志相关API
// 分页查询审计日志
export function getAuditLogs(params?: {
  page?: number
  size?: number
  userId?: number
  action?: string
  startTime?: string
  endTime?: string
  status?: string
}) {
  const queryParams = new URLSearchParams()
  if (params?.page !== undefined) queryParams.append('page', params.page.toString())
  if (params?.size !== undefined) queryParams.append('size', params.size.toString())
  if (params?.userId !== undefined) queryParams.append('userId', params.userId.toString())
  if (params?.action) queryParams.append('action', params.action)
  if (params?.startTime) queryParams.append('startTime', params.startTime)
  if (params?.endTime) queryParams.append('endTime', params.endTime)
  if (params?.status) queryParams.append('status', params.status)
  
  const queryString = queryParams.toString()
  const url = queryString ? `/v1/admin/audit/logs?${queryString}` : '/v1/admin/audit/logs'
  
  return apiRequest(url, {
    method: 'GET'
  })
}

// 获取日志统计信息
export function getAuditLogStatistics() {
  return apiRequest('/v1/admin/audit/statistics', {
    method: 'GET'
  })
}