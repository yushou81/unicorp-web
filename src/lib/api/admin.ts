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
  return apiRequest('/admin/organizations/schools', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

// 获取待审核组织列表
export function getPendingOrganizations() {
  return apiRequest('/admin/approvals/organizations')
}

// 审核通过组织
export function approveOrganization(id: number) {
  return apiRequest(`/admin/approvals/organizations/${id}/approve`, {
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
  return apiRequest('/admin/organizations/schools', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

// 获取待审核企业注册列表
export function getPendingEnterprises() {
  return apiRequest('/admin/approvals/organizations')
}

// [Admin]批准企业注册
export function approveEnterprise(id: number) {
  return apiRequest(`/admin/enterprises/${id}/approve`, {
    method: 'PUT'
  })
}

// 获取所有学校列表
export function getAllSchools(page?: number, size?: number) {
  const params = new URLSearchParams()
  if (page !== undefined) params.append('page', page.toString())
  if (size !== undefined) params.append('size', size.toString())
  
  const queryString = params.toString()
  const url = queryString ? `/admin/schools?${queryString}` : '/admin/schools'
  
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
  const url = queryString ? `/admin/enterprises?${queryString}` : '/admin/enterprises'
  
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
  return apiRequest(`/admin/users/${id}`, {
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
  const url = queryString ? `/admin/users?${queryString}` : '/admin/users'
  
  return apiRequest(url, {
    method: 'GET'
  })
} 
// 修改用户状态（激活/禁用）
export function updateUserStatus(id: number, status: 'active' | 'inactive') {
  return apiRequest(`/admin/users/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  })
}