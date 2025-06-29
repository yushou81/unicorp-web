const API_BASE_URL =  'http://192.168.58.154:8081/api/v1'

let token = ''
export function setToken(t: string) {
  token = t
}

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const headers = Object.assign(
    { 'Content-Type': 'application/json' },
    options.headers || {}
  ) as Record<string, string>
  if (token) headers['Authorization'] = `Bearer ${token}`

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
      data = { success: true }
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
  return data as T
} 