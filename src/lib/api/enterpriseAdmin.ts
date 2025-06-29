import { apiRequest } from './apiClient'

// 企业管理员创建企业导师账号
export function createMentor(data: {
  email: string
  nickname?: string
  password: string
  phone?: string
}) {
  return apiRequest('/v1/enterprise-admin/mentors', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

// 获取企业导师列表（分页）
export function getMentorList(params: { page?: number; size?: number } = {}) {
  const query = new URLSearchParams()
  if (params.page !== undefined) query.append('page', String(params.page))
  if (params.size !== undefined) query.append('size', String(params.size))
  const q = query.toString() ? `?${query.toString()}` : ''
  return apiRequest(`/v1/enterprise-admin/mentors${q}`)
}

// 更新导师状态
export function updateMentorStatus(id: number, status: 'active' | 'inactive' | 'pending_approval') {
  const query = new URLSearchParams()
  query.append('status', status)
  return apiRequest(`/v1/enterprise-admin/mentors/${id}/status?${query.toString()}`, {
    method: 'PUT'
  })
}

// 更新导师基本信息
export function updateMentorInfo(id: number, data: {
  email?: string
  nickname?: string
  phone?: string
}) {
  return apiRequest(`/v1/enterprise-admin/mentors/${id}/info`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
} 