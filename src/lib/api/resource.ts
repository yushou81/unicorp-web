import { apiRequest } from './apiClient'

/**
 * 获取资源列表 (分页和搜索)
 * @param params 查询参数
 */
export async function getResources(params: {
  page?: number
  size?: number
  keyword?: string
  category?: string
  type?: string
  status?: string
}) {
  const queryParams = new URLSearchParams()
  if (params.page !== undefined) queryParams.append('page', params.page.toString())
  if (params.size !== undefined) queryParams.append('size', params.size.toString())
  if (params.keyword) queryParams.append('keyword', params.keyword)
  if (params.category) queryParams.append('category', params.category)
  
  // 支持多个资源类型(逗号分隔)
  if (params.type) {
    if (params.type.includes(',')) {
      // 如果有多个资源类型，拆分并添加多个type参数
      params.type.split(',').forEach(type => {
        if (type.trim()) queryParams.append('resourceType', type.trim())
      })
    } else {
      queryParams.append('resourceType', params.type)
    }
  }
  
  // 支持多个状态(逗号分隔)
  if (params.status) {
    if (params.status.includes(',')) {
      params.status.split(',').forEach(status => {
        if (status.trim()) queryParams.append('status', status.trim())
      })
    } else {
      queryParams.append('status', params.status)
    }
  }
  
  // 使用方式
  if ((params as any).usage) {
    queryParams.append('usage', (params as any).usage)
  }

  console.log('API请求参数:', queryParams.toString())
  return apiRequest(`/resources?${queryParams.toString()}`)
}

/**
 * 获取单个资源详情
 * @param id 资源ID
 */
export async function getResourceById(id: string | number) {
  return apiRequest(`/resources/${id}`)
}

/**
 * 上传文件并创建资源（一步完成）
 * @param data 表单数据，包含资源信息和文件
 */
export async function uploadResource(data: {
  title: string
  resourceType: string
  description?: string
  visibility?: 'public' | 'private' | 'organization_only'
  file?: File // 专利/著作权可不传文件
  image?: File // 专利/著作权可选图片
}) {
  const formData = new FormData()
  formData.append('title', data.title)
  formData.append('resourceType', data.resourceType)
  if (data.description) formData.append('description', data.description)
  if (data.visibility) formData.append('visibility', data.visibility)
  if (data.file) formData.append('file', data.file)
  if (data.image) formData.append('image', data.image)
  
  return apiRequest(`/resources/upload`, {
    method: 'POST',
    body: formData
  })
}

/**
 * 上传文件并更新资源（一步完成）
 * @param id 资源ID
 * @param data 表单数据，包含资源信息和可选的文件
 */
export async function updateResourceWithFile(
  id: string | number,
  data: {
    title?: string
    resourceType?: string
    description?: string
    visibility?: 'public' | 'private' | 'organization_only'
    file?: File
    image?: File // 专利/著作权可选图片
  }
) {
  const formData = new FormData()
  if (data.title) formData.append('title', data.title)
  if (data.resourceType) formData.append('resourceType', data.resourceType)
  if (data.description) formData.append('description', data.description)
  if (data.visibility) formData.append('visibility', data.visibility)
  if (data.file) formData.append('file', data.file)
  if (data.image) formData.append('image', data.image)
  
  return apiRequest(`/resources/${id}/upload`, {
    method: 'POST',
    body: formData
  })
}

/**
 * @deprecated 已弃用，请使用uploadResource方法
 */
export async function createResource(data: {
  title: string
  description: string
  resourceType: string
  fileUrl: string
  fileType?: string
  visibility?: 'public' | 'private' | 'organization_only'
}) {
  return apiRequest('/resources', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

/**
 * @deprecated 已弃用，请使用updateResourceWithFile方法
 */
export async function updateResource(
  id: string | number,
  data: {
    title?: string
    description?: string
    resourceType?: string
    fileUrl?: string
    fileType?: string
    visibility?: 'public' | 'private' | 'organization_only'
  }
) {
  return apiRequest(`/resources/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

/**
 * 删除资源
 * @param id 资源ID
 */
export async function deleteResource(id: string | number) {
  return apiRequest(`/resources/${id}`, {
    method: 'DELETE'
  })
}

/**
 * @deprecated 已弃用，请使用uploadResource或updateResourceWithFile方法
 */
export async function uploadFile(file: File, type: string = 'resource') {
  const formData = new FormData()
  formData.append('file', file)
  
  return apiRequest(`/files/upload?type=${type}`, {
    method: 'POST',
    body: formData
  })
}

/**
 * 提交资源使用申请
 * @param resourceId 资源ID
 * @param data 申请数据
 */
export async function submitResourceApplication(
  resourceId: string | number,
  data: {
    name: string
    contact: string
    purpose: string
    startTime: string
    endTime: string
  }
) {
  return apiRequest(`/resources/equipment/bookings`, {
    method: 'POST',
    body: JSON.stringify({
      resourceId,
      startTime: data.startTime,
      endTime: data.endTime,
      purpose: data.purpose
    })
  })
}

/**
 * 收藏资源
 * @param resourceId 资源ID
 */
export async function collectResource(resourceId: string | number) {
  return apiRequest(`/resources/${resourceId}/collect`, {
    method: 'POST'
  })
}

/**
 * 添加资源评价
 * @param resourceId 资源ID
 * @param content 评价内容
 */
export async function addResourceComment(resourceId: string | number, content: string) {
  return apiRequest(`/resources/${resourceId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ content })
  })
}

/**
 * 获取资源评价列表
 * @param resourceId 资源ID
 */
export async function getResourceComments(resourceId: string | number) {
  return apiRequest(`/resources/${resourceId}/comments`)
}

/**
 * 获取设备预约列表
 * @param params 查询参数
 */
export async function getEquipmentBookings(params: {
  page?: number
  size?: number
  userId?: number
  resourceId?: number
  status?: string
  organizationId?: number
}) {
  const queryParams = new URLSearchParams()
  if (params.page !== undefined) queryParams.append('page', params.page.toString())
  if (params.size !== undefined) queryParams.append('size', params.size.toString())
  if (params.userId !== undefined) queryParams.append('userId', params.userId.toString())
  if (params.resourceId !== undefined) queryParams.append('resourceId', params.resourceId.toString())
  if (params.status) queryParams.append('status', params.status)
  if (params.organizationId !== undefined) queryParams.append('organizationId', params.organizationId.toString())
  
  return apiRequest(`/resources/equipment/bookings?${queryParams.toString()}`)
}

/**
 * 获取设备预约详情
 * @param id 预约ID
 */
export async function getEquipmentBookingById(id: string | number) {
  return apiRequest(`/resources/equipment/bookings/${id}`)
}

/**
 * 审核设备预约申请
 * @param data 审核信息
 */
export async function reviewEquipmentBooking(data: {
  bookingId: number
  approved: boolean
  rejectReason?: string
}) {
  // 根据接口要求，构造正确的请求体格式
  const requestData = {
    bookingId: data.bookingId,
    approve: data.approved ? 'APPROVED' : 'REJECTED',
    rejectReason: data.rejectReason
  }
  
  return apiRequest(`/resources/equipment/bookings/review`, {
    method: 'POST',
    body: JSON.stringify(requestData)
  })
}

/**
 * 取消设备预约
 * @param id 预约ID
 */
export async function cancelEquipmentBooking(id: string | number) {
  return apiRequest(`/resources/equipment/bookings/${id}/cancel`, {
    method: 'POST'
  })
}

/**
 * 获取资源被占用的时间段
 * @param resourceId 资源ID
 */
export async function getResourceBookings(resourceId: string | number) {
  return apiRequest(`/resources/${resourceId}/bookings`)
}

/**
 * 获取用户的所有设备预约申请
 */
export async function getMyEquipmentBookings() {
  return apiRequest('/resources/equipment/bookings/my')
}

/**
 * 下载资源文件
 * @param id 资源ID
 */
export function downloadResource(id: string | number) {
  // 创建完整URL
  const url = `http://127.0.0.1:8081/api/v1/resources/${id}/download`
  
  // 打开新窗口下载文件
  window.open(url, '_blank')
  
  // 也可以使用以下方式下载（不需要返回值）
  // const a = document.createElement('a')
  // a.href = url
  // a.target = '_blank'
  // a.download = '' // 让服务器决定文件名
  // document.body.appendChild(a)
  // a.click()
  // document.body.removeChild(a)
} 