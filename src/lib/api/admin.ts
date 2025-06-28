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