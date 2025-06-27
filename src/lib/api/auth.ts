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
  organization_name: string
  description?: string
  address?: string
  website?: string
  industry?: string
  company_size?: string
  business_license_url: string
  admin_email: string
  admin_nickname?: string
  admin_password: string
  admin_phone?: string
}) {
  return apiRequest('/auth/register/enterprise', {
    method: 'POST',
    body: JSON.stringify(data)
  })
} 