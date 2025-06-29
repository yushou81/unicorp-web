import { apiRequest } from './apiClient'

// 学校管理员创建教师账号
export function createTeacher(data: {
  email: string
  nickname?: string
  password: string
  phone?: string
}) {
  return apiRequest('/v1/school-admin/teachers', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

// 获取本校所有用户（支持分页和按角色筛选）
export function getAllUsers(params: Record<string, any> = {}) {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach(v => query.append(key, v))
      } else {
        query.append(key, String(value))
      }
    }
  })
  const q = query.toString() ? `?${query.toString()}` : ''
  return apiRequest(`/v1/school-admin/users${q}`)
}

// 更新用户基本信息
export function updateUserInfo(id: number, data: {
  email?: string
  nickname?: string
  phone?: string
}) {
  return apiRequest(`/v1/school-admin/users/${id}/info`, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
  })
}

// 更新用户状态
export function updateUserStatus(id: number, status: 'active' | 'inactive' | 'pending_approval') {
  return apiRequest(`/v1/school-admin/users/${id}/status?status=${status}`, {
    method: 'PUT'
  })
}

// 启用用户账号（已弃用，建议使用 updateUserStatus）
export function enableUser(id: number) {
  return apiRequest(`/v1/school-admin/users/${id}/enable`, {
    method: 'PUT'
  })
} 