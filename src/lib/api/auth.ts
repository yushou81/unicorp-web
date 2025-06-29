import { apiRequest } from './apiClient'

// 登录
export function login(data: { loginType: 'account'|'email'|'phone'; principal: string; password: string }) {
  return apiRequest<{ token: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

// 获取当前用户
export function getMe() {
  return apiRequest('/auth/me')
}

// 修改用户密码
export function updatePassword(data: {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}) {
  return apiRequest('/auth/password', {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

// 修改用户基本信息
export function updateUserInfo(data: {
  nickname?: string
  email?: string
  phone?: string
}) {
  return apiRequest('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

// 学生注册
export function registerStudent(data: {
  nickname?: string
  password: string
  email: string
  phone?: string
  organization_id: number
  real_name: string
  id_card: string
}) {
  return apiRequest('/auth/register/student', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

// 企业注册
export function registerEnterprise(data: {
  organizationName: string
  companyCode: string
  description?: string
  address?: string
  website?: string
  industry?: string
  companySize?: string
  businessLicenseUrl: string
  adminEmail: string
  adminNickname?: string
  adminPassword: string
  adminPhone?: string
}) {
  return apiRequest('/auth/register/enterprise', {
    method: 'POST',
    body: JSON.stringify(data)
  })
} 