import { apiRequest } from './apiClient'

// 创建apiClient对象
const apiClient = {
  get: <T>(url: string, config?: any) => apiRequest<T>(url, { method: 'GET', ...config }),
  post: <T>(url: string, data?: any, config?: any) => apiRequest<T>(url, { method: 'POST', body: JSON.stringify(data), ...config }),
  put: <T>(url: string, data?: any, config?: any) => apiRequest<T>(url, { method: 'PUT', body: JSON.stringify(data), ...config }),
  delete: <T>(url: string, config?: any) => apiRequest<T>(url, { method: 'DELETE', ...config })
}

// 类型定义
export interface TopicVO {
  id: number
  title: string
  content: string
  userId: number
  userName: string
  userAvatar: string
  categoryId: number
  categoryName: string
  viewCount: number
  likeCount: number
  commentCount: number
  favoriteCount: number
  isSticky: boolean
  isEssence: boolean
  isLiked: boolean
  isFavorited: boolean
  tags: TagVO[]
  createdAt: string
  updatedAt: string
}

export interface QuestionVO {
  id: number
  title: string
  content: string
  authorId: number
  authorName: string
  authorAvatar: string
  viewCount: number
  likeCount: number
  answerCount: number
  favoriteCount: number
  isSolved: boolean
  acceptedAnswerId?: number
  isLiked: boolean
  isFavorited: boolean
  tags: TagVO[]
  createdAt: string
  updatedAt: string
}

export interface AnswerVO {
  id: number
  questionId: number
  content: string
  authorId: number
  authorName: string
  authorAvatar: string
  likeCount: number
  commentCount: number
  isAccepted: boolean
  isLiked: boolean
  createdAt: string
  updatedAt: string
}

export interface CommentVO {
  id: number
  content: string
  authorId: number
  authorName: string
  authorAvatar: string
  targetId: number
  targetType: 'topic' | 'question' | 'answer' | 'comment'
  parentId?: number
  replyToId?: number
  replyToName?: string
  likeCount: number
  isLiked: boolean
  createdAt: string
}

export interface TagVO {
  id: number
  name: string
  description?: string
  useCount: number
}

export interface CategoryVO {
  id: number
  name: string
  description?: string
  icon?: string
  parentId?: number
  parentName?: string
  sortOrder: number
  topicCount?: number
  permissionLevel?: number
  children?: CategoryVO[]
  createdAt: string
  updatedAt: string
}

export interface NotificationVO {
  id: number
  userId: number
  title: string
  content: string
  type: string
  targetId?: number
  targetType?: string
  senderId?: number
  senderName?: string
  senderAvatar?: string
  isRead: boolean
  createdAt: string
}

export interface TopicDTO {
  title: string
  content: string
  categoryId: number
  tagIds?: number[]
}

export interface QuestionDTO {
  title: string
  content: string
  tagIds?: number[]
}

export interface AnswerDTO {
  questionId: number
  content: string
}

export interface CommentDTO {
  targetId: number
  targetType: 'topic' | 'question' | 'answer' | 'comment'
  content: string
  parentId?: number
  replyToId?: number
}

export interface CategoryDTO {
  name: string
  description?: string
  icon?: string
  parentId?: number
  sortOrder?: number
}

export interface PageResult<T> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
}

export interface ResultVO<T = any> {
  code: number
  message: string
  data: T
  success: boolean
}

// 话题相关API
export const topicApi = {
  // 创建话题
  create: (data: TopicDTO) => 
    apiClient.post<ResultVO<number>>('/v1/community/topics', data),

  // 获取话题列表
  getList: (params?: { page?: number; size?: number }) => 
    apiClient.get<ResultVO<PageResult<TopicVO>>>('/v1/community/topics', { params }),

  // 获取话题详情
  getDetail: (topicId: number) => 
    apiClient.get<ResultVO<TopicVO>>(`/v1/community/topics/${topicId}`),

  // 更新话题
  update: (topicId: number, data: TopicDTO) => 
    apiClient.put<ResultVO<any>>(`/v1/community/topics/${topicId}`, data),

  // 删除话题
  delete: (topicId: number) => 
    apiClient.delete<ResultVO<any>>(`/v1/community/topics/${topicId}`),

  // 获取热门话题
  getHot: (params?: { page?: number; size?: number }) => 
    apiClient.get<ResultVO<PageResult<TopicVO>>>('/v1/community/topics/hot', { params }),

  // 获取最新话题
  getLatest: (params?: { page?: number; size?: number }) => 
    apiClient.get<ResultVO<PageResult<TopicVO>>>('/v1/community/topics/latest', { params }),

  // 获取精华话题
  getEssence: (params?: { page?: number; size?: number }) => 
    apiClient.get<ResultVO<PageResult<TopicVO>>>('/v1/community/topics/essence', { params }),

  // 搜索话题
  search: (keyword: string, page = 1, size = 10) => 
    apiClient.get<ResultVO<PageResult<TopicVO>>>('/v1/community/topics/search', { 
      params: { keyword, page, size } 
    }),

  // 获取用户话题
  getUserTopics: (userId: number, params?: { page?: number; size?: number }) => 
    apiClient.get<ResultVO<PageResult<TopicVO>>>(`/v1/community/topics/user/${userId}`, { params }),

  // 获取板块话题
  getCategoryTopics: (categoryId: number, params?: { page?: number; size?: number }) => 
    apiClient.get<ResultVO<PageResult<TopicVO>>>(`/v1/community/topics/category/${categoryId}`, { params }),

  // 设置置顶状态
  setSticky: (topicId: number, isSticky: boolean) => 
    apiClient.put<ResultVO<any>>(`/v1/community/topics/${topicId}/sticky`, null, { 
      params: { isSticky } 
    }),

  // 设置精华状态
  setEssence: (topicId: number, isEssence: boolean) => 
    apiClient.put<ResultVO<any>>(`/v1/community/topics/${topicId}/essence`, null, { 
      params: { isEssence } 
    }),

  // 获取推荐话题
  getRecommend: (limit?: number) => 
    apiClient.get<ResultVO<TopicVO[]>>('/v1/community/topics/recommend', { 
      params: { limit } 
    })
}

// 问题相关API
export const questionApi = {
  // 创建问题
  create: (data: QuestionDTO) => 
    apiClient.post<ResultVO<number>>('/v1/community/questions', data),

  // 获取问题详情
  getDetail: (questionId: number) => 
    apiClient.get<ResultVO<QuestionVO>>(`/v1/community/questions/${questionId}`),

  // 更新问题
  update: (questionId: number, data: QuestionDTO) => 
    apiClient.put<ResultVO<any>>(`/v1/community/questions/${questionId}`, data),

  // 删除问题
  delete: (questionId: number) => 
    apiClient.delete<ResultVO<any>>(`/v1/community/questions/${questionId}`),

  // 获取热门问题
  getHot: (params?: { page?: number; size?: number }) => 
    apiClient.get<ResultVO<PageResult<QuestionVO>>>('/v1/community/questions/hot', { params }),

  // 获取最新问题
  getLatest: (params?: { page?: number; size?: number }) => 
    apiClient.get<ResultVO<PageResult<QuestionVO>>>('/v1/community/questions/latest', { params }),

  // 搜索问题
  search: (keyword: string, params?: { page?: number; size?: number }) => 
    apiClient.get<ResultVO<PageResult<QuestionVO>>>('/v1/community/questions/search', { 
      params: { keyword, ...params } 
    }),

  // 获取用户问题
  getUserQuestions: (userId: number, params?: { page?: number; size?: number }) => 
    apiClient.get<ResultVO<PageResult<QuestionVO>>>(`/v1/community/questions/user/${userId}`, { params }),

  // 获取未解决问题
  getUnsolved: (params?: { page?: number; size?: number }) => 
    apiClient.get<ResultVO<PageResult<QuestionVO>>>('/v1/community/questions/unsolved', { params }),

  // 标记问题为已解决
  markSolved: (questionId: number, answerId: number) => 
    apiClient.put<ResultVO<any>>(`/v1/community/questions/${questionId}/solved`, null, { 
      params: { answerId } 
    }),

  // 获取相关问题
  getRelated: (questionId: number, limit?: number) => 
    apiClient.get<ResultVO<PageResult<QuestionVO>>>(`/v1/community/questions/${questionId}/related`, { 
      params: { limit } 
    })
}

// 回答相关API
export const answerApi = {
  // 创建回答
  create: (data: AnswerDTO) => 
    apiClient.post<ResultVO<number>>('/v1/community/answers', data),

  // 获取回答详情
  getDetail: (answerId: number) => 
    apiClient.get<ResultVO<AnswerVO>>(`/v1/community/answers/${answerId}`),

  // 更新回答
  update: (answerId: number, data: AnswerDTO) => 
    apiClient.put<ResultVO<any>>(`/v1/community/answers/${answerId}`, data),

  // 删除回答
  delete: (answerId: number) => 
    apiClient.delete<ResultVO<any>>(`/v1/community/answers/${answerId}`),

  // 获取问题的回答列表
  getQuestionAnswers: (questionId: number, params?: { page?: number; size?: number; sort?: 'latest' | 'hot' }) => 
    apiClient.get<ResultVO<PageResult<AnswerVO>>>(`/v1/community/answers/question/${questionId}`, { params }),

  // 获取用户的回答列表
  getUserAnswers: (userId: number, params?: { page?: number; size?: number }) => 
    apiClient.get<ResultVO<PageResult<AnswerVO>>>(`/v1/community/answers/user/${userId}`, { params })
}

// 评论相关API
export const commentApi = {
  // 创建评论
  create: (data: CommentDTO) => 
    apiClient.post<ResultVO<number>>('/v1/community/comments', data),

  // 删除评论
  delete: (commentId: number) => 
    apiClient.delete<ResultVO<any>>(`/v1/community/comments/${commentId}`),

  // 获取话题评论
  getTopicComments: (topicId: number, params?: { page?: number; size?: number }) => 
    apiClient.get<ResultVO<PageResult<CommentVO>>>(`/v1/community/comments/topic/${topicId}`, { params }),

  // 获取回答评论
  getAnswerComments: (answerId: number, params?: { page?: number; size?: number }) => 
    apiClient.get<ResultVO<PageResult<CommentVO>>>(`/v1/community/comments/answer/${answerId}`, { params }),

  // 获取评论回复
  getCommentReplies: (commentId: number, params?: { page?: number; size?: number }) => 
    apiClient.get<ResultVO<PageResult<CommentVO>>>(`/v1/community/comments/${commentId}/replies`, { params }),

  // 获取用户评论
  getUserComments: (userId: number, params?: { page?: number; size?: number }) => 
    apiClient.get<ResultVO<PageResult<CommentVO>>>(`/v1/community/comments/user/${userId}`, { params })
}

// 交互相关API
export const interactionApi = {
  // 点赞
  like: (targetId: number, targetType: 'topic' | 'question' | 'answer' | 'comment') => 
    apiClient.post<ResultVO<any>>('/v1/community/interactions/likes', null, { 
      params: { targetId, targetType } 
    }),

  // 取消点赞
  unlike: (targetId: number, targetType: 'topic' | 'question' | 'answer' | 'comment') => 
    apiClient.delete<ResultVO<any>>('/v1/community/interactions/likes', { 
      params: { targetId, targetType } 
    }),

  // 收藏
  favorite: (targetId: number, targetType: 'topic' | 'question') => 
    apiClient.post<ResultVO<any>>('/v1/community/interactions/favorites', null, { 
      params: { targetId, targetType } 
    }),

  // 取消收藏
  unfavorite: (targetId: number, targetType: 'topic' | 'question') => 
    apiClient.delete<ResultVO<any>>('/v1/community/interactions/favorites', { 
      params: { targetId, targetType } 
    }),

  // 获取收藏的话题
  getFavoriteTopics: (params?: { page?: number; size?: number }) => 
    apiClient.get<ResultVO<PageResult<TopicVO>>>('/v1/community/interactions/favorites/topics', { params }),

  // 获取收藏的问题
  getFavoriteQuestions: (params?: { page?: number; size?: number }) => 
    apiClient.get<ResultVO<PageResult<QuestionVO>>>('/v1/community/interactions/favorites/questions', { params }),

  // 获取点赞的回答
  getLikedAnswers: (params?: { page?: number; size?: number }) => 
    apiClient.get<ResultVO<PageResult<AnswerVO>>>('/v1/community/interactions/likes/answers', { params }),

  // 检查是否点赞
  checkLiked: (targetId: number, targetType: 'topic' | 'question' | 'answer' | 'comment') => 
    apiClient.get<ResultVO<boolean>>('/v1/community/interactions/likes/check', { 
      params: { targetId, targetType } 
    }),

  // 检查是否收藏
  checkFavorited: (targetId: number, targetType: 'topic' | 'question') => 
    apiClient.get<ResultVO<boolean>>('/v1/community/interactions/favorites/check', { 
      params: { targetId, targetType } 
    })
}

// 标签相关API
export const tagApi = {
  // 获取标签列表
  getList: (params?: { page?: number; size?: number; sort?: 'useCount' | 'name' }) => 
    apiClient.get<ResultVO<PageResult<TagVO>>>('/v1/community/tags', { params }),

  // 创建标签
  create: (data: { name: string; description?: string }) => 
    apiClient.post<ResultVO<number>>('/v1/community/tags', data),

  // 获取标签详情
  getDetail: (tagId: number) => 
    apiClient.get<ResultVO<TagVO>>(`/v1/community/tags/${tagId}`),

  // 更新标签
  update: (tagId: number, data: { name?: string; description?: string }) => 
    apiClient.put<ResultVO<any>>(`/v1/community/tags/${tagId}`, data),

  // 删除标签
  delete: (tagId: number) => 
    apiClient.delete<ResultVO<any>>(`/v1/community/tags/${tagId}`),

  // 搜索标签
  search: (keyword: string, limit?: number) => 
    apiClient.get<ResultVO<TagVO[]>>('/v1/community/tags/search', { 
      params: { keyword, limit } 
    }),

  // 获取热门标签
  getHot: (limit?: number) => 
    apiClient.get<ResultVO<TagVO[]>>('/v1/community/tags/hot', { 
      params: { limit } 
    })
}

// 板块相关API
export const categoryApi = {
  // 获取板块列表
  getList: () => 
    apiClient.get<ResultVO<CategoryVO[]>>('/v1/community/categories'),

  // 获取板块树形结构
  getTree: () => 
    apiClient.get<ResultVO<CategoryVO[]>>('/v1/community/categories/tree'),

  // 创建板块
  create: (data: CategoryDTO) => 
    apiClient.post<ResultVO<number>>('/v1/community/categories', data),

  // 获取板块详情
  getDetail: (categoryId: number) => 
    apiClient.get<ResultVO<CategoryVO>>(`/v1/community/categories/${categoryId}`),

  // 更新板块
  update: (categoryId: number, data: CategoryDTO) => 
    apiClient.put<ResultVO<any>>(`/v1/community/categories/${categoryId}`, data),

  // 删除板块
  delete: (categoryId: number) => 
    apiClient.delete<ResultVO<any>>(`/v1/community/categories/${categoryId}`)
} 