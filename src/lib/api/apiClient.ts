const API_BASE_URL =  'http://127.0.0.1:8081/api/v1'

let token = ''
export function setToken(t: string) {
  token = t
}

// API响应类型定义
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

export async function apiRequest<T = any>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`
  const headers = { ...options.headers } as Record<string, string>

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  // Handle Content-Type
  if (options.body instanceof FormData) {
    // For FormData, we must delete the Content-Type header.
    // The browser will automatically set it to 'multipart/form-data'
    // with the correct boundary.
    delete headers['Content-Type']
  } else {
    // For other requests, default to 'application/json' if not provided.
    if (!headers['Content-Type']) {
      headers['Content-Type'] = 'application/json'
    }
  }

  // 调试输出
  console.log('[apiRequest] 请求:', {
    url,
    method: options.method || 'GET',
    headers,
    body: options.body
  })

  let response, rawText, data
  try {
    response = await fetch(url, { ...options, headers })
    rawText = await response.text()
    
    // 对于 204 No Content 状态码，不需要解析 JSON
    if (response.status === 204) {
      data = { code: 204, message: 'No Content', success: true, data: null }
    } else {
      try {
        data = JSON.parse(rawText)
      } catch (jsonErr) {
        console.error('[apiRequest] JSON 解析失败:', jsonErr, '原始响应:', rawText)
        throw new Error('响应不是合法 JSON')
      }
    }
  } catch (fetchErr) {
    console.error('[apiRequest] fetch 错误:', fetchErr)
    throw fetchErr
  }

  // 调试输出
  console.log('[apiRequest] 响应:', {
    url,
    status: response.status,
    data,
    rawText
  })

  if (!response.ok) throw new Error(data.message || '请求失败')
  return data as ApiResponse<T>
} 