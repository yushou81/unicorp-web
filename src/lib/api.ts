// API服务配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  code?: number
}

class ApiService {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    }

    try {
      const response = await fetch(url, { ...defaultOptions, ...options })
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || '请求失败')
      }
      
      return data
    } catch (error) {
      console.error('API请求错误:', error)
      throw error
    }
  }

  // 用户相关API
  async login(credentials: { username: string; password: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  async getUserInfo() {
    return this.request('/user/info')
  }

  // 机构相关API
  async getOrganizations() {
    return this.request('/organizations')
  }

  async createOrganization(org: any) {
    return this.request('/organizations', {
      method: 'POST',
      body: JSON.stringify(org),
    })
  }

  // 申报相关API
  async getApplications() {
    return this.request('/applications')
  }

  async createApplication(application: any) {
    return this.request('/applications', {
      method: 'POST',
      body: JSON.stringify(application),
    })
  }

  // 职位相关API
  async getJobs(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : ''
    return this.request(`/jobs${queryString}`)
  }

  // 课程相关API
  async getCourses() {
    return this.request('/courses')
  }

  async getLearningRecords() {
    return this.request('/learning-records')
  }
}

export const apiService = new ApiService(API_BASE_URL) 