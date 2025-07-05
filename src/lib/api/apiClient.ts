// 我自己留着测的
//const API_BASE_URL =  'http://localhost:8081/api'

import axios from 'axios'

const API_BASE_URL =  'http://192.168.58.74:8081/api'

let token = ''
export function setToken(t: string) {
  token = t
}

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`



  //我写的，先留着
  // let headers: Record<string, string> = { ...(options.headers as Record<string, string> || {}) }
  // if (!(options.body instanceof FormData)) {
  //   headers['Content-Type'] = 'application/json'
  // }


  
  // 初始化headers
  let headers: Record<string, string> = {}
  
  // 如果提供了自定义headers，使用它
  if (options.headers !== undefined) {
    headers = Object.assign({}, options.headers) as Record<string, string>
  } else {
    // 否则设置默认的Content-Type，但如果是FormData则不设置
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
    }
  }
  
  // 添加认证token
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

    //未带时间戳的，可能没用，先留着
    //response = await fetch(url, { ...options, headers, body: options.body })

    // 添加时间戳，避免缓存
    const urlWithTimestamp = url.includes('?') 
      ? `${url}&_t=${Date.now()}` 
      : `${url}?_t=${Date.now()}`
    
    response = await fetch(urlWithTimestamp, { ...options, headers })

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


  // 检查响应状态和业务状态码
  if (!response.ok) {
    const errorMsg = data?.message || '请求失败'
    console.error(`[apiRequest] HTTP错误: ${response.status} - ${errorMsg}`)
    throw new Error(errorMsg)
  }
  
  // 检查业务状态码
  if (data?.code !== 200) {
    const errorMsg = data?.message || '业务处理失败'
    console.error(`[apiRequest] 业务错误: ${data?.code} - ${errorMsg}`)
    throw new Error(errorMsg)
  }

  // 检查分页数据
  if (data?.data?.pages !== undefined) {
    console.log(`[apiRequest] 分页数据: 当前页=${data.data.current}, 总页数=${data.data.pages}, 总记录数=${data.data.total}`)
  }


  return data as T
} 

// 创建axios实例
export const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 从localStorage获取token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    // 如果响应成功,直接返回数据
    return response.data
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // token过期或无效,清除token并跳转到登录页
          localStorage.removeItem('token')
          window.location.href = '/login'
          break
        case 403:
          // 权限不足
          console.error('权限不足')
          break
        case 404:
          // 请求的资源不存在
          console.error('请求的资源不存在')
          break
        case 500:
          // 服务器错误
          console.error('服务器错误')
          break
        default:
          console.error(`未知错误: ${error.response.status}`)
      }
    }
    return Promise.reject(error)
  }
) 