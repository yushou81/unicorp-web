import { apiRequest } from './apiClient'

// 定义API响应类型
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

// 定义分页响应类型
export interface PagedResponse<T> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
}

// 课程状态枚举
export enum CourseStatus {
  PLANNING = 'planning',
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// 课程类型枚举
export enum CourseType {
  ONLINE = 'online',
  OFFLINE = 'offline',
  HYBRID = 'hybrid'
}

// 课程创建/更新DTO
export interface DualTeacherCourseDTO {
  title: string
  description: string
  teacherId?: number
  mentorId?: number
  scheduledTime: string
  maxStudents?: number
  location?: string
  courseType: CourseType
}

// 课程详情VO
export interface DualTeacherCourseVO {
  id: number
  title: string
  description: string
  teacherId: number
  teacherName: string
  teacherAvatar?: string
  mentorId: number
  mentorName: string
  mentorAvatar?: string
  enterpriseName: string
  scheduledTime: string
  maxStudents: number
  enrolledCount: number
  location: string
  courseType: CourseType
  status: CourseStatus
  createdAt: string
}

// 课程报名DTO
export interface CourseEnrollmentDTO {
  courseId: number
}

// 课程评价DTO
export interface CourseRatingDTO {
  courseId: number
  rating: number
  comment: string
}

// 课程评价VO
export interface CourseRatingVO {
  id: number
  courseId: number
  courseTitle: string
  studentId: number
  studentName: string
  rating: number
  content: string
  createdAt: string
  updatedAt: string
}

// 课程评价统计
export interface CourseRatingStatistics {
  averageRating: number
  totalRatings: number
  ratingDistribution: {
    [key: string]: number
  }
  averageTeachingRating?: number
  averageContentRating?: number
  averageInteractionRating?: number
}

// 课程资源DTO
export interface CourseResourceDTO {
  courseId: number
  title: string
  description?: string
  resourceType: 'document' | 'video' | 'code' | 'other'
}

// 课程资源VO
export interface CourseResourceVO {
  id: number
  courseId: number
  courseTitle: string
  title: string
  description: string
  resourceType: string
  fileUrl: string
  fileSize: number
  fileType: string
  uploaderId: number
  uploaderName: string
  uploaderRole: string
  createdAt: string
}

// 课程章节DTO
export interface CourseChapterDTO {
  courseId: number
  title: string
  description?: string
  sequence?: number
}

// 课程章节VO
export interface CourseChapterVO {
  id: number
  courseId: number
  courseTitle: string
  title: string
  description: string
  sequence: number
  isPublished: boolean
  resourceCount: number
  createdAt: string
  updatedAt: string
}

// 学习进度DTO
export interface LearningProgressDTO {
  chapterId: number
  status: 'not_started' | 'in_progress' | 'completed'
  progressPercent?: number
  durationMinutes?: number
}

// 学习进度VO
export interface LearningProgressVO {
  id: number
  studentId: number
  studentName: string
  chapterId: number
  chapterTitle: string
  courseId: number
  courseTitle: string
  status: 'not_started' | 'in_progress' | 'completed'
  progressPercent: number
  startTime: string
  completeTime?: string
  durationMinutes?: number
}

// 课程出勤DTO
export interface CourseAttendanceDTO {
  courseId: number
  studentId: number
  date: string // yyyy-MM-dd
  status: 'present' | 'absent' | 'late'
  remark?: string
}

// 课程出勤VO
export interface CourseAttendanceVO {
  id: number
  courseId: number
  studentId: number
  studentName: string
  date: string
  status: 'present' | 'absent' | 'late'
  remark?: string
  createdAt: string
  updatedAt: string
}

// 课程讨论DTO
export interface CourseDiscussionDTO {
  courseId: number
  parentId?: number // 回复时传
  content: string
}

// 课程讨论VO
export interface CourseDiscussionVO {
  id: number
  courseId: number
  parentId?: number
  content: string
  userId: number
  userName: string
  createdAt: string
  updatedAt: string
  replies?: CourseDiscussionVO[]
}

// 课程问答DTO
export interface CourseQuestionDTO {
  courseId?: number
  chapterId?: number
  title: string
  content: string
}

// 课程问答VO
export interface CourseQuestionVO {
  id: number
  courseId: number
  chapterId?: number
  studentId: number
  studentName: string
  title: string
  content: string
  answer?: string
  answerUserId?: number
  answerUserName?: string
  status: 'pending' | 'answered' | 'closed'
  createdAt: string
  updatedAt: string
  answeredAt?: string
}

// 创建双师课堂课程
export async function createCourse(courseData: DualTeacherCourseDTO) {
  return apiRequest<ApiResponse<DualTeacherCourseVO>>('/v1/dual-courses', {
    method: 'POST',
    body: JSON.stringify(courseData)
  })
}

// 获取课程详情
export async function getCourseById(id: number) {
  return apiRequest<ApiResponse<DualTeacherCourseVO>>(`/v1/dual-courses/${id}`)
}

// 更新课程信息
export async function updateCourse(id: number, courseData: DualTeacherCourseDTO) {
  return apiRequest<ApiResponse<DualTeacherCourseVO>>(`/v1/dual-courses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(courseData)
  })
}

// 删除课程
export async function deleteCourse(id: number) {
  return apiRequest<ApiResponse<null>>(`/v1/dual-courses/${id}`, {
    method: 'DELETE'
  })
}

// 更新课程状态
export async function updateCourseStatus(id: number, status: CourseStatus) {
  return apiRequest<ApiResponse<DualTeacherCourseVO>>(`/v1/dual-courses/${id}/status?status=${status}`, {
    method: 'PATCH'
  })
}

// 获取教师创建的课程列表
export async function getTeacherCourses(page = 1, size = 10) {
  return apiRequest<ApiResponse<PagedResponse<DualTeacherCourseVO>>>(`/v1/dual-courses/teacher?page=${page}&size=${size}`)
}

// 获取企业导师参与的课程列表
export async function getMentorCourses(page = 1, size = 10) {
  return apiRequest<ApiResponse<PagedResponse<DualTeacherCourseVO>>>(`/v1/dual-courses/mentor?page=${page}&size=${size}`)
}

// 获取可报名的课程列表
export async function getEnrollableCourses(page = 1, size = 10, keyword?: string, courseType?: string) {
  let url = `/v1/dual-courses/enrollable?page=${page}&size=${size}`;
  if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;
  if (courseType) url += `&courseType=${courseType}`;
  return apiRequest<ApiResponse<PagedResponse<DualTeacherCourseVO>>>(url);
}

// 学生报名课程
export async function enrollCourse(courseId: number) {
  const enrollmentData: CourseEnrollmentDTO = { courseId }
  return apiRequest<ApiResponse<null>>('/v1/dual-courses/enroll', {
    method: 'POST',
    body: JSON.stringify(enrollmentData)
  })
}

// 学生取消报名
export async function cancelEnrollment(courseId: number) {
  return apiRequest<ApiResponse<null>>(`/v1/dual-courses/enroll/${courseId}`, {
    method: 'DELETE'
  })
}

// 获取学生已报名的课程列表
export async function getStudentEnrolledCourses(page = 1, size = 10) {
  return apiRequest<ApiResponse<PagedResponse<DualTeacherCourseVO>>>(`/v1/dual-courses/enrolled?page=${page}&size=${size}`)
}

// 更新学生选课状态
export async function updateEnrollmentStatus(enrollmentId: number, status: 'enrolled' | 'cancelled' | 'completed') {
  return apiRequest<ApiResponse<null>>(`/v1/dual-courses/enrollment/${enrollmentId}/status?status=${status}`, {
    method: 'PATCH'
  })
}

// 获取课程的学生列表
export async function getCourseStudents(courseId: number) {
  return apiRequest<ApiResponse<Array<{
    id: number
    name: string
    email?: string
    studentId?: string
    enrollTime: string
    status: string
  }>>>(`/v1/dual-courses/${courseId}/students`)
}

// 提交课程评价
export async function submitRating(ratingData: CourseRatingDTO) {
  // 兼容后端字段，content和comment都传
  const data = { ...ratingData, comment: ratingData.comment }
  return apiRequest<ApiResponse<CourseRatingVO>>('/v1/course-ratings', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

// 获取课程评价详情
export async function getRatingById(ratingId: number) {
  return apiRequest<ApiResponse<CourseRatingVO>>(`/v1/course-ratings/${ratingId}`)
}

// 更新课程评价
export async function updateRating(ratingId: number, ratingData: CourseRatingDTO) {
  // 兼容后端字段，content和comment都传
  const data = { ...ratingData, comment: ratingData.comment }
  return apiRequest<ApiResponse<CourseRatingVO>>(`/v1/course-ratings/${ratingId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

// 删除课程评价
export async function deleteRating(ratingId: number) {
  return apiRequest<ApiResponse<boolean>>(`/v1/course-ratings/${ratingId}`, {
    method: 'DELETE'
  })
}

// 获取课程评价列表
export async function getRatingsByCourseId(courseId: number, page = 1, size = 10) {
  return apiRequest<ApiResponse<PagedResponse<CourseRatingVO>>>(`/v1/course-ratings/course/${courseId}?page=${page}&size=${size}`)
}

// 获取课程平均评分
export async function getAverageRating(courseId: number) {
  return apiRequest<ApiResponse<number>>(`/v1/course-ratings/course/${courseId}/average`)
}

// 检查学生是否已评价
export async function hasStudentRated(courseId: number, studentId: number) {
  return apiRequest<ApiResponse<boolean>>(`/v1/course-ratings/course/${courseId}/student/${studentId}/has-rated`)
}

// 获取学生对课程的评价
export async function getStudentRating(courseId: number, studentId: number) {
  return apiRequest<ApiResponse<CourseRatingVO>>(`/v1/course-ratings/course/${courseId}/student/${studentId}`)
}

// 获取课程评价统计
export async function getRatingStatistics(courseId: number) {
  return apiRequest<ApiResponse<CourseRatingStatistics>>(`/v1/course-ratings/course/${courseId}/statistics`)
}

// 检查学生是否已报名课程
export async function checkStudentEnrollment(courseId: number, studentId: number) {
  return apiRequest<ApiResponse<boolean>>(`/v1/dual-courses/enrollment/check?courseId=${courseId}&studentId=${studentId}`)
}

// 上传课程资源
export async function uploadResource(formData: FormData) {
  return apiRequest<ApiResponse<CourseResourceVO>>('/v1/course-resources', {
    method: 'POST',
    body: formData
  })
}

// 获取资源详情
export async function getResourceById(resourceId: number) {
  return apiRequest<ApiResponse<CourseResourceVO>>(`/v1/course-resources/${resourceId}`)
}

// 更新资源信息
export async function updateResource(resourceId: number, data: { title: string, description?: string, resourceType: string }) {
  return apiRequest<ApiResponse<CourseResourceVO>>(`/v1/course-resources/${resourceId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

// 删除资源
export async function deleteResource(resourceId: number) {
  return apiRequest<ApiResponse<boolean>>(`/v1/course-resources/${resourceId}`, {
    method: 'DELETE'
  })
}

// 获取课程资源列表
export async function getResourcesByCourseId(courseId: number, page = 1, size = 10, resourceType?: string) {
  let url = `/v1/course-resources/course/${courseId}?page=${page}&size=${size}`;
  if (resourceType) url += `&resourceType=${resourceType}`;
  return apiRequest<ApiResponse<PagedResponse<CourseResourceVO>>>(url);
}

// 搜索课程资源
export async function searchResources(courseId: number, keyword: string, page = 1, size = 10, resourceType?: string) {
  let url = `/v1/course-resources/search?courseId=${courseId}&keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`;
  if (resourceType) url += `&resourceType=${resourceType}`;
  return apiRequest<ApiResponse<PagedResponse<CourseResourceVO>>>(url);
}

// 获取课程资源类型统计
export async function getResourceTypeStats(courseId: number) {
  return apiRequest<ApiResponse<Record<string, number>>>(`/v1/course-resources/course/${courseId}/types`);
}

// 获取资源下载URL
export function getResourceDownloadUrl(resourceId: number) {
  return `v1/course-resources/download/${resourceId}`;
}

// 创建课程章节
export async function createChapter(chapterData: CourseChapterDTO) {
  return apiRequest<ApiResponse<CourseChapterVO>>('/v1/course-chapters', {
    method: 'POST',
    body: JSON.stringify(chapterData)
  });
}

// 更新课程章节
export async function updateChapter(id: number, chapterData: CourseChapterDTO) {
  return apiRequest<ApiResponse<CourseChapterVO>>(`/v1/course-chapters/${id}`, {
    method: 'PUT',
    body: JSON.stringify(chapterData)
  });
}

// 获取章节详情
export async function getChapterById(id: number) {
  return apiRequest<ApiResponse<CourseChapterVO>>(`/v1/course-chapters/${id}`);
}

// 删除章节
export async function deleteChapter(id: number) {
  return apiRequest<ApiResponse<boolean>>(`/v1/course-chapters/${id}`, {
    method: 'DELETE'
  });
}

// 获取课程章节列表
export async function getChaptersByCourseId(courseId: number) {
  return apiRequest<ApiResponse<CourseChapterVO[]>>(`/v1/course-chapters/course/${courseId}`);
}

// 发布章节
export async function publishChapter(id: number) {
  return apiRequest<ApiResponse<CourseChapterVO>>(`/v1/course-chapters/${id}/publish?isPublished=true`, {
    method: 'PUT'
  });
}

// 取消发布章节
export async function unpublishChapter(id: number) {
  return apiRequest<ApiResponse<CourseChapterVO>>(`/v1/course-chapters/${id}/publish?isPublished=false`, {
    method: 'PUT'
  });
}

// 更新章节发布状态
export async function updateChapterPublishStatus(id: number, isPublished: boolean) {
  return apiRequest<ApiResponse<CourseChapterVO>>(`/v1/course-chapters/${id}/publish?isPublished=${isPublished}`, {
    method: 'PUT'
  });
}

// 重新排序章节
export async function reorderChapters(courseId: number, chapterOrders: { chapterId: number, sequence: number }[]) {
  return apiRequest<ApiResponse<boolean>>(`/v1/course-chapters/course/${courseId}/reorder`, {
    method: 'PUT',
    body: JSON.stringify({ chapterOrders })
  });
}

// 更新章节顺序
export async function updateChapterSequence(id: number, sequence: number) {
  // 由于接口文档中只有批量重新排序的接口，这里需要先获取所有章节，然后调用重新排序接口
  // 这是一个简化的实现，实际使用时可能需要更复杂的逻辑
  const courseId = 0; // 需要从章节信息中获取
  return reorderChapters(courseId, [{ chapterId: id, sequence }]);
}

// 获取章节资源
export async function getChapterResources(chapterId: number) {
  return apiRequest<ApiResponse<CourseResourceVO[]>>(`/v1/course-chapters/${chapterId}/resources`);
}

// 添加章节资源
export async function addChapterResource(chapterId: number, resourceId: number) {
  return apiRequest<ApiResponse<boolean>>(`/v1/course-chapters/${chapterId}/resources/add`, {
    method: 'POST',
    body: JSON.stringify({ resourceId })
  });
}

// 移除章节资源
export async function removeChapterResource(chapterId: number, resourceId: number) {
  return apiRequest<ApiResponse<boolean>>(`/v1/course-chapters/${chapterId}/resources/${resourceId}`, {
    method: 'DELETE'
  })
}

// 关联资源到章节（兼容旧接口）
export async function removeResourceFromChapter(chapterId: number, resourceId: number) {
  return removeChapterResource(chapterId, resourceId);
}

// 章节关联资源
export async function associateResourceToChapter(chapterId: number, resourceId: number) {
  return apiRequest<ApiResponse<boolean>>(`/v1/course-chapters/${chapterId}/resources/${resourceId}`, {
    method: 'POST'
  })
}

// 更新学习进度
export async function updateLearningProgress(progressData: LearningProgressDTO) {
  return apiRequest<ApiResponse<LearningProgressVO>>('/v1/learning-progress', {
    method: 'PUT',
    body: JSON.stringify(progressData)
  });
}

// 获取学习进度详情
export async function getProgressById(id: number) {
  return apiRequest<ApiResponse<LearningProgressVO>>(`/v1/learning-progress/${id}`);
}

// 获取学生在课程中的学习进度
export async function getStudentProgressInCourse(courseId: number, studentId: number) {
  return apiRequest<ApiResponse<LearningProgressVO[]>>(`/v1/learning-progress/course/${courseId}/student/${studentId}`);
}

// 获取学生在章节中的学习进度
export async function getStudentProgressInChapter(chapterId: number, studentId: number) {
  return apiRequest<ApiResponse<LearningProgressVO>>(`/v1/learning-progress/chapter/${chapterId}/student/${studentId}`);
}

// 获取课程学习进度统计 - 使用已实现的overview接口
export async function getCourseProgressStatistics(courseId: number) {
  try {
    // 获取课程概览数据
    const overviewRes = await apiRequest<ApiResponse<any>>(`/v1/learning-progress/course/${courseId}/overview`);
    console.log('后端返回的原始数据:', overviewRes.data);
    
    if (overviewRes.code !== 200 || !overviewRes.data) {
      return overviewRes;
    }
    
    // 获取课程学生列表来计算学生总数
    const studentsRes = await apiRequest<ApiResponse<any>>(`/v1/dual-courses/${courseId}/students`);
    const totalStudents = studentsRes.code === 200 && studentsRes.data ? studentsRes.data.length : 0;
    
    // 获取课程章节列表
    const chaptersRes = await apiRequest<ApiResponse<any>>(`/v1/course-chapters/course/${courseId}`);
    const chapters = chaptersRes.code === 200 && chaptersRes.data ? chaptersRes.data : [];
    
    // 计算平均进度：如果有学生，获取所有学生的进度并计算平均值
    let averageProgress = 0;
    if (totalStudents > 0 && studentsRes.code === 200 && studentsRes.data) {
      let totalProgress = 0;
      let validStudentCount = 0;
      
      // 获取每个学生的课程进度
      for (const student of studentsRes.data) {
        try {
          const studentProgressRes = await apiRequest<ApiResponse<any>>(`/v1/learning-progress/course/${courseId}/student/${student.id}`);
          if (studentProgressRes.code === 200 && studentProgressRes.data && studentProgressRes.data.length > 0) {
            const studentAvgProgress = studentProgressRes.data.reduce((sum: number, p: any) => sum + (p.progressPercent || 0), 0) / studentProgressRes.data.length;
            totalProgress += studentAvgProgress;
            validStudentCount++;
          }
        } catch (err) {
          console.warn('获取学生进度失败:', err);
        }
      }
      
      if (validStudentCount > 0) {
        averageProgress = Math.round(totalProgress / validStudentCount);
      }
    }
    
    // 兼容overview接口的字段
    const processedData = {
      totalStudents: totalStudents,
      averageProgress: averageProgress,
      completionRate: overviewRes.data.averageCompletionRate ?? overviewRes.data.completionRate ?? overviewRes.data.avgCompletionRate ?? 0,
      completedChapters: overviewRes.data.completedChapters ?? 0,
      inProgressChapters: overviewRes.data.inProgressChapters ?? 0,
      notStartedChapters: overviewRes.data.notStartedChapters ?? 0,
      chapterCount: overviewRes.data.chapterCount ?? chapters.length,
      // 其他字段按需补充
    };
    
    console.log('处理后的数据:', processedData);
    
    return {
      ...overviewRes,
      data: processedData
    }
  } catch (err) {
    console.error('获取课程进度统计错误:', err);
    return {
      code: 500,
      message: '获取课程进度统计失败',
      data: null
    };
  }
}

// 获取章节学习进度统计 - 使用已实现的students接口
export async function getChapterProgressStatistics(chapterId: number) {
  const res = await apiRequest<ApiResponse<PagedResponse<LearningProgressVO>>>(`/v1/learning-progress/chapter/${chapterId}/students?page=1&size=100`);
  
  // 转换数据结构以匹配组件期望的格式
  if (res.code === 200 && res.data) {
    const students = res.data.records;
    const totalStudents = students.length;
    
    if (totalStudents === 0) {
      return {
        ...res,
        data: {
          totalStudents: 0,
          averageProgress: 0,
          completionRate: 0,
          averageTimeSpent: 0,
          studentProgressList: []
        }
      };
    }
    
    // 计算统计数据
    const totalProgress = students.reduce((sum, student) => sum + student.progressPercent, 0);
    const averageProgress = Math.round(totalProgress / totalStudents);
    
    const completedStudents = students.filter(student => student.status === 'completed').length;
    const completionRate = Math.round((completedStudents / totalStudents) * 100);
    
    const totalTimeSpent = students.reduce((sum, student) => sum + (student.durationMinutes || 0), 0);
    const averageTimeSpent = Math.round(totalTimeSpent / totalStudents);
    
    // 转换学生列表格式
    const studentProgressList = students.map(student => ({
      studentId: student.studentId,
      studentName: student.studentName,
      progress: student.progressPercent,
      isCompleted: student.status === 'completed',
      timeSpent: student.durationMinutes || 0
    }));
    
    return {
      ...res,
      data: {
        totalStudents,
        averageProgress,
        completionRate,
        averageTimeSpent,
        studentProgressList
      }
    };
  }
  
  return res;
}

// 获取章节所有学生进度（分页）
export async function getChapterStudentsProgress(chapterId: number, page = 1, size = 10) {
  return apiRequest<ApiResponse<PagedResponse<LearningProgressVO>>>(`/v1/learning-progress/chapter/${chapterId}/students?page=${page}&size=${size}`);
}

// 获取课程进度概览（保留原有接口以兼容）
export async function getCourseProgressOverview(courseId: number) {
  return apiRequest<ApiResponse<{
    totalStudents: number,
    completedStudents: number,
    averageProgress: number,
    chapterProgressStats: {
      chapterId: number,
      chapterTitle: string,
      completedCount: number,
      inProgressCount: number,
      notStartedCount: number
    }[]
  }>>(`/v1/learning-progress/course/${courseId}/overview`);
}

// 获取学生课程完成率
export async function getCourseCompletionRate(courseId: number, studentId: number) {
  return apiRequest<ApiResponse<number>>(`/v1/learning-progress/course/${courseId}/student/${studentId}/completion-rate`);
}

// 初始化章节学习进度
export async function initializeChapterProgress(chapterId: number) {
  return apiRequest<ApiResponse<null>>(`/v1/learning-progress/chapter/${chapterId}/initialize`, {
    method: 'POST'
  });
}



// 批量初始化课程所有学生的学习进度
export async function initializeCourseProgressForAllStudents(courseId: number) {
  return apiRequest<ApiResponse<null>>(`/v1/learning-progress/course/${courseId}/initialize-all`, {
    method: 'POST'
  });
}

// 记录课程出勤
export async function recordAttendance(data: CourseAttendanceDTO) {
  return apiRequest<ApiResponse<boolean>>('/v1/course-attendance', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

// 更新出勤记录
export async function updateAttendance(id: number, status: 'present' | 'absent' | 'late', remark?: string) {
  let url = `/v1/course-attendance/${id}?status=${status}`
  if (remark) url += `&remark=${encodeURIComponent(remark)}`
  return apiRequest<ApiResponse<CourseAttendanceVO>>(url, {
    method: 'PUT'
  })
}

// 删除出勤记录
export async function deleteAttendance(id: number) {
  return apiRequest<ApiResponse<boolean>>(`/v1/course-attendance/${id}`, {
    method: 'DELETE'
  })
}

// 获取课程某天的出勤记录
export async function getCourseAttendanceByDate(courseId: number, date: string) {
  return apiRequest<ApiResponse<CourseAttendanceVO[]>>(`/v1/course-attendance/course/${courseId}/date/${date}`)
}

// 获取学生在课程中的所有出勤记录
export async function getStudentAttendance(courseId: number, studentId: number) {
  return apiRequest<ApiResponse<CourseAttendanceVO[]>>(`/v1/course-attendance/course/${courseId}/student/${studentId}`)
}

// 获取课程出勤日期列表
export async function getCourseAttendanceDates(courseId: number, page = 1, size = 10) {
  return apiRequest<ApiResponse<PagedResponse<string>>>(`/v1/course-attendance/course/${courseId}/dates?page=${page}&size=${size}`)
}

// 获取课程出勤率
export async function getCourseAttendanceRate(courseId: number) {
  return apiRequest<ApiResponse<number>>(`/v1/course-attendance/course/${courseId}/attendance-rate`)
}

// 获取学生在课程中的出勤率
export async function getStudentAttendanceRate(courseId: number, studentId: number) {
  return apiRequest<ApiResponse<number>>(`/v1/course-attendance/course/${courseId}/student/${studentId}/attendance-rate`)
}

// 获取课程出勤统计
export async function getAttendanceStatistics(courseId: number) {
  return apiRequest<ApiResponse<{
    totalDates: number
    totalStudents: number
    averageAttendanceRate: number
    statusDistribution: {
      present: number
      absent: number
      late: number
    }
    dateAttendanceRates: Record<string, number>
  }>>(`/v1/course-attendance/course/${courseId}/statistics`)
}

// 创建讨论/回复
export async function createDiscussion(data: CourseDiscussionDTO) {
  // 如果有 parentId，走 /reply 路径
  if (data.parentId) {
    return apiRequest<ApiResponse<CourseDiscussionVO>>('/v1/course-discussions/reply', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  } else {
    return apiRequest<ApiResponse<CourseDiscussionVO>>('/v1/course-discussions', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }
}

// 获取讨论详情
export async function getDiscussionDetail(id: number) {
  return apiRequest<ApiResponse<CourseDiscussionVO>>(`/v1/course-discussions/${id}`)
}

// 更新讨论内容
export async function updateDiscussion(id: number, content: string) {
  // 新API：PUT /v1/course-discussions/{id}?content=xxx
  return apiRequest<ApiResponse<CourseDiscussionVO>>(`/v1/course-discussions/${id}?content=${encodeURIComponent(content)}`, {
    method: 'PUT'
  })
}

// 删除讨论
export async function deleteDiscussion(id: number) {
  return apiRequest<ApiResponse<boolean>>(`/v1/course-discussions/${id}`, {
    method: 'DELETE'
  })
}

// 获取课程讨论列表（分页）
export async function getCourseDiscussions(courseId: number, page = 1, size = 10) {
  return apiRequest<ApiResponse<PagedResponse<CourseDiscussionVO>>>(`/v1/course-discussions/course/${courseId}?page=${page}&size=${size}`)
}

// 获取讨论回复（分页）
export async function getDiscussionReplies(discussionId: number, page = 1, size = 10) {
  return apiRequest<ApiResponse<PagedResponse<CourseDiscussionVO>>>(`/v1/course-discussions/${discussionId}/replies?page=${page}&size=${size}`)
}

// 获取课程讨论总数
export async function countCourseDiscussions(courseId: number) {
  return apiRequest<ApiResponse<number>>(`/v1/course-discussions/course/${courseId}/count`)
}

// 课程问答相关API
export async function askQuestion(data: CourseQuestionDTO) {
  return apiRequest<ApiResponse<CourseQuestionVO>>('/v1/course-questions', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}
// 回答问题
export async function answerQuestion(id: number, answer: string) {
  // 新API：PUT /v1/course-questions/{id}?answer=xxx
  return apiRequest<ApiResponse<CourseQuestionVO>>(`/v1/course-questions/${id}?answer=${encodeURIComponent(answer)}`, {
    method: 'PUT'
  })
}
export async function getQuestionDetail(id: number) {
  return apiRequest<ApiResponse<CourseQuestionVO>>(`/v1/course-questions/${id}`)
}
// 更新问题内容
export async function updateQuestion(id: number, data: CourseQuestionDTO) {
  // 正确API：PUT /v1/course-questions/{id}?title=xxx&content=xxx
  const params = new URLSearchParams()
  if (data.title) params.append('title', data.title)
  if (data.content) params.append('content', data.content)
  return apiRequest<ApiResponse<CourseQuestionVO>>(
    `/v1/course-questions/${id}?${params.toString()}`,
    { method: 'PUT' }
  )
}
export async function deleteQuestion(id: number) {
  return apiRequest<ApiResponse<boolean>>(`/v1/course-questions/${id}`, {
    method: 'DELETE'
  })
}
export async function getCourseQuestions(courseId: number, page = 1, size = 10) {
  let url = `/v1/course-questions/course/${courseId}?page=${page}&size=${size}`
  return apiRequest<ApiResponse<PagedResponse<CourseQuestionVO>>>(url)
}
export async function getChapterQuestions(chapterId: number, page = 1, size = 10) {
  let url = `/v1/course-questions/chapter/${chapterId}?page=${page}&size=${size}`
  return apiRequest<ApiResponse<PagedResponse<CourseQuestionVO>>>(url)
}
export async function getStudentQuestions(studentId: number, page = 1, size = 10) {
  let url = `/v1/course-questions/student/${studentId}?page=${page}&size=${size}`
  return apiRequest<ApiResponse<PagedResponse<CourseQuestionVO>>>(url)
}
export async function getCourseQuestionStatistics(courseId: number) {
  return apiRequest<ApiResponse<any>>(`/v1/course-questions/course/${courseId}/statistics`)
}
export async function getTeacherPendingQuestionCount(teacherId: number) {
  return apiRequest<ApiResponse<number>>(`/v1/course-questions/teacher/${teacherId}/pending-count`)
}

// 获取课程过滤后的列表
export async function getCoursesList(params: {
  page?: number,
  size?: number,
  keyword?: string,
  status?: string,
  courseType?: string
}) {
  const { page = 1, size = 10, keyword, status, courseType } = params;
  let url = `/v1/dual-courses?page=${page}&size=${size}`;
  if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;
  if (status) url += `&status=${status}`;
  if (courseType) url += `&courseType=${courseType}`;
  
  return apiRequest<ApiResponse<PagedResponse<DualTeacherCourseVO>>>(url);
}

// 检查学生是否已报名课程
export async function isEnrolledInCourse(courseId: number) {
  return apiRequest<ApiResponse<boolean>>(`/v1/dual-courses/${courseId}/enrollment-status`);
} 