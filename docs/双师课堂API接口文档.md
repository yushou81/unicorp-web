# 双师课堂 API 接口文档

## 概述

本文档详细描述了双师课堂功能模块的所有API接口，包括请求方法、URL、参数说明、响应数据结构以及权限要求。这些接口分为课程管理、报名管理、资源管理、评价管理和用户相关几个部分。

## 通用数据结构

### 通用响应格式

所有API接口的响应都遵循以下格式：

```typescript
interface ApiResponse<T> {
  code: number;        // 状态码：200成功，其他表示错误
  message: string;     // 响应消息
  data: T;             // 响应数据，类型根据具体接口定义
}
```

### 分页响应格式

支持分页的接口返回的数据结构如下：

```typescript
interface PagedResponse<T> {
  records: T[];        // 当前页的数据记录
  total: number;       // 总记录数
  size: number;        // 每页记录数
  current: number;     // 当前页码
  pages: number;       // 总页数
}
```

### 课程相关枚举

```typescript
enum CourseType {
  ONLINE = "online",    // 线上
  OFFLINE = "offline",  // 线下
  HYBRID = "hybrid"     // 混合
}

enum CourseStatus {
  PLANNING = "planning",        // 筹备中
  OPEN = "open",                // 开放报名
  IN_PROGRESS = "in_progress",  // 进行中
  COMPLETED = "completed",      // 已结束
  CANCELLED = "cancelled"       // 已取消
}
```

## 1. 课程管理接口

### 1.1 创建课程

- **请求方法**: POST
- **URL**: `/v1/dual-courses`
- **请求体**:

```typescript
{
  "title": "企业级Web应用开发实战",
  "description": "本课程由XX大学与XX公司联合开设，旨在通过实际项目开发提升学生的实践能力...",
  "teacherId": 1001,
  "mentorId": 2001,
  "scheduledTime": "2023-12-01T09:00:00",
  "maxStudents": 30,
  "location": "线上+XX大学教学楼B201",
  "courseType": "hybrid"
}
```

- **响应**:

```typescript
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "title": "企业级Web应用开发实战",
    "description": "本课程由XX大学与XX公司联合开设，旨在通过实际项目开发提升学生的实践能力...",
    "teacherId": 1001,
    "teacherName": "张教授",
    "mentorId": 2001,
    "mentorName": "李导师",
    "enterpriseName": "XX科技有限公司",
    "scheduledTime": "2023-12-01T09:00:00",
    "maxStudents": 30,
    "enrolledCount": 0,
    "location": "线上+XX大学教学楼B201",
    "courseType": "hybrid",
    "status": "planning",
    "createdAt": "2023-11-15T14:30:00"
  }
}
```

- **权限**: 教师、学校管理员

### 1.2 获取课程列表

- **请求方法**: GET
- **URL**: `/v1/dual-courses`
- **查询参数**:
  - `page`: 页码，默认1
  - `size`: 每页记录数，默认10
  - `keyword`: 关键词搜索（可选）
  - `status`: 课程状态筛选（可选）
  - `courseType`: 课程类型筛选（可选）

- **响应**:

```typescript
{
  "code": 200,
  "message": "success",
  "data": {
    "records": [
      {
        "id": 1,
        "title": "企业级Web应用开发实战",
        "description": "本课程由XX大学与XX公司联合开设，旨在通过实际项目开发提升学生的实践能力...",
        "teacherId": 1001,
        "teacherName": "张教授",
        "mentorId": 2001,
        "mentorName": "李导师",
        "enterpriseName": "XX科技有限公司",
        "scheduledTime": "2023-12-01T09:00:00",
        "maxStudents": 30,
        "enrolledCount": 0,
        "location": "线上+XX大学教学楼B201",
        "courseType": "hybrid",
        "status": "planning",
        "createdAt": "2023-11-15T14:30:00"
      },
      // 更多课程记录...
    ],
    "total": 100,
    "size": 10,
    "current": 1,
    "pages": 10
  }
}
```

- **权限**: 所有用户

### 1.3 获取课程详情

- **请求方法**: GET
- **URL**: `/v1/dual-courses/{id}`
- **路径参数**:
  - `id`: 课程ID

- **响应**:

```typescript
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "title": "企业级Web应用开发实战",
    "description": "本课程由XX大学与XX公司联合开设，旨在通过实际项目开发提升学生的实践能力...",
    "teacherId": 1001,
    "teacherName": "张教授",
    "mentorId": 2001,
    "mentorName": "李导师",
    "enterpriseName": "XX科技有限公司",
    "scheduledTime": "2023-12-01T09:00:00",
    "maxStudents": 30,
    "enrolledCount": 0,
    "location": "线上+XX大学教学楼B201",
    "courseType": "hybrid",
    "status": "planning",
    "createdAt": "2023-11-15T14:30:00"
  }
}
```

- **权限**: 所有用户

### 1.4 更新课程

- **请求方法**: PUT
- **URL**: `/v1/dual-courses/{id}`
- **路径参数**:
  - `id`: 课程ID
- **请求体**:

```typescript
{
  "title": "企业级Web应用开发实战（2023版）",
  "description": "更新后的课程描述...",
  "mentorId": 2002,
  "scheduledTime": "2023-12-05T09:00:00",
  "maxStudents": 40,
  "location": "线上+XX大学教学楼B301",
  "courseType": "hybrid"
}
```

- **响应**:

```typescript
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "title": "企业级Web应用开发实战（2023版）",
    "description": "更新后的课程描述...",
    "teacherId": 1001,
    "teacherName": "张教授",
    "mentorId": 2002,
    "mentorName": "王导师",
    "enterpriseName": "XX科技有限公司",
    "scheduledTime": "2023-12-05T09:00:00",
    "maxStudents": 40,
    "enrolledCount": 0,
    "location": "线上+XX大学教学楼B301",
    "courseType": "hybrid",
    "status": "planning",
    "createdAt": "2023-11-15T14:30:00"
  }
}
```

- **权限**: 课程创建者、学校管理员

### 1.5 删除课程

- **请求方法**: DELETE
- **URL**: `/v1/dual-courses/{id}`
- **路径参数**:
  - `id`: 课程ID

- **响应**:

```typescript
{
  "code": 200,
  "message": "课程删除成功",
  "data": null
}
```

- **权限**: 课程创建者、学校管理员

### 1.6 更新课程状态

- **请求方法**: PATCH
- **URL**: `/v1/dual-courses/{id}/status`
- **路径参数**:
  - `id`: 课程ID
- **查询参数**:
  - `status`: 新状态（planning/open/in_progress/completed/cancelled）

- **响应**:

```typescript
{
  "code": 200,
  "message": "课程状态更新成功",
  "data": null
}
```

- **权限**: 课程创建者、学校管理员

### 1.7 获取教师创建的课程

- **请求方法**: GET
- **URL**: `/v1/dual-courses/teacher`
- **查询参数**:
  - `page`: 页码，默认1
  - `size`: 每页记录数，默认10

- **响应**:

```typescript
{
  "code": 200,
  "message": "success",
  "data": {
    "records": [
      {
        "id": 1,
        "title": "企业级Web应用开发实战",
        "description": "课程描述...",
        "teacherId": 1001,
        "teacherName": "张教授",
        "mentorId": 2001,
        "mentorName": "李导师",
        "enterpriseName": "XX科技有限公司",
        "scheduledTime": "2023-12-01T09:00:00",
        "maxStudents": 30,
        "enrolledCount": 0,
        "location": "线上+XX大学教学楼B201",
        "courseType": "hybrid",
        "status": "planning",
        "createdAt": "2023-11-15T14:30:00"
      },
      // 更多课程记录...
    ],
    "total": 5,
    "size": 10,
    "current": 1,
    "pages": 1
  }
}
```

- **权限**: 教师

### 1.8 获取可报名的课程列表

- **请求方法**: GET
- **URL**: `/v1/dual-courses/enrollable`
- **查询参数**:
  - `page`: 页码，默认1
  - `size`: 每页记录数，默认10
  - `keyword`: 关键词搜索（可选）
  - `courseType`: 课程类型筛选（可选）

- **响应**:

```typescript
{
  "code": 200,
  "message": "success",
  "data": {
    "records": [
      {
        "id": 1,
        "title": "企业级Web应用开发实战",
        "description": "课程描述...",
        "teacherId": 1001,
        "teacherName": "张教授",
        "mentorId": 2001,
        "mentorName": "李导师",
        "enterpriseName": "XX科技有限公司",
        "scheduledTime": "2023-12-01T09:00:00",
        "maxStudents": 30,
        "enrolledCount": 0,
        "location": "线上+XX大学教学楼B201",
        "courseType": "hybrid",
        "status": "open",
        "createdAt": "2023-11-15T14:30:00"
      },
      // 更多课程记录...
    ],
    "total": 50,
    "size": 10,
    "current": 1,
    "pages": 5
  }
}
```

- **权限**: 所有用户

## 2. 报名管理接口

### 2.1 学生报名课程

- **请求方法**: POST
- **URL**: `/v1/dual-courses/enroll`
- **请求体**:

```typescript
{
  "courseId": 1
}
```

- **响应**:

```typescript
{
  "code": 200,
  "message": "报名成功",
  "data": null
}
```

- **权限**: 学生

### 2.2 学生取消报名

- **请求方法**: DELETE
- **URL**: `/v1/dual-courses/enroll/{courseId}`
- **路径参数**:
  - `courseId`: 课程ID

- **响应**:

```typescript
{
  "code": 200,
  "message": "取消报名成功",
  "data": null
}
```

- **权限**: 学生

### 2.3 获取学生已报名的课程列表

- **请求方法**: GET
- **URL**: `/v1/dual-courses/enrolled`
- **查询参数**:
  - `page`: 页码，默认1
  - `size`: 每页记录数，默认10

- **响应**:

```typescript
{
  "code": 200,
  "message": "success",
  "data": {
    "records": [
      {
        "id": 1,
        "title": "企业级Web应用开发实战",
        "description": "课程描述...",
        "teacherId": 1001,
        "teacherName": "张教授",
        "mentorId": 2001,
        "mentorName": "李导师",
        "enterpriseName": "XX科技有限公司",
        "scheduledTime": "2023-12-01T09:00:00",
        "maxStudents": 30,
        "enrolledCount": 15,
        "location": "线上+XX大学教学楼B201",
        "courseType": "hybrid",
        "status": "open",
        "createdAt": "2023-11-15T14:30:00"
      },
      // 更多课程记录...
    ],
    "total": 3,
    "size": 10,
    "current": 1,
    "pages": 1
  }
}
```

- **权限**: 学生

### 2.4 更新学生选课状态

- **请求方法**: PATCH
- **URL**: `/v1/dual-courses/enrollment/{enrollmentId}/status`
- **路径参数**:
  - `enrollmentId`: 报名记录ID
- **查询参数**:
  - `status`: 新状态（enrolled/cancelled/completed）

- **响应**:

```typescript
{
  "code": 200,
  "message": "选课状态更新成功",
  "data": null
}
```

- **权限**: 教师、学校管理员

### 2.5 获取课程的学生列表

- **请求方法**: GET
- **URL**: `/v1/dual-courses/{courseId}/students`
- **路径参数**:
  - `courseId`: 课程ID

- **响应**:

```typescript
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 3001,
      "name": "王学生",
      "email": "student@example.com",
      "studentId": "2023001",
      "enrollTime": "2023-11-20T10:15:00",
      "status": "enrolled"
    },
    {
      "id": 3002,
      "name": "李学生",
      "email": "student2@example.com",
      "studentId": "2023002",
      "enrollTime": "2023-11-21T14:30:00",
      "status": "enrolled"
    },
    // 更多学生记录...
  ]
}
```

- **权限**: 课程教师、企业导师、学校管理员

## 3. 资源管理接口

### 3.1 上传课程资源

- **请求方法**: POST
- **URL**: `/v1/course-resources`
- **Content-Type**: `multipart/form-data`
- **请求体**:
  - `file`: 文件
  - `data`: JSON字符串，包含资源信息
    ```json
    {
      "courseId": 1,
      "title": "第一周课程PPT",
      "description": "包含课程概述和基础知识点",
      "resourceType": "document"
    }
    ```

- **响应**:

```typescript
{
  "code": 200,
  "message": "资源上传成功",
  "data": {
    "id": 101,
    "courseId": 1,
    "courseTitle": "企业级Web应用开发实战",
    "uploaderId": 1001,
    "uploaderName": "张教授",
    "title": "第一周课程PPT",
    "description": "包含课程概述和基础知识点",
    "resourceType": "document",
    "fileUrl": "https://example.com/storage/resources/101.pptx",
    "fileSize": 2048000,
    "downloadCount": 0,
    "uploadTime": "2023-11-25T09:30:00"
  }
}
```

- **权限**: 课程教师、企业导师

### 3.2 获取课程资源列表

- **请求方法**: GET
- **URL**: `/v1/course-resources/course/{courseId}`
- **路径参数**:
  - `courseId`: 课程ID
- **查询参数**:
  - `page`: 页码，默认1
  - `size`: 每页记录数，默认10
  - `resourceType`: 资源类型筛选（可选）

- **响应**:

```typescript
{
  "code": 200,
  "message": "success",
  "data": {
    "records": [
      {
        "id": 101,
        "courseId": 1,
        "courseTitle": "企业级Web应用开发实战",
        "uploaderId": 1001,
        "uploaderName": "张教授",
        "title": "第一周课程PPT",
        "description": "包含课程概述和基础知识点",
        "resourceType": "document",
        "fileUrl": "https://example.com/storage/resources/101.pptx",
        "fileSize": 2048000,
        "downloadCount": 5,
        "uploadTime": "2023-11-25T09:30:00"
      },
      {
        "id": 102,
        "courseId": 1,
        "courseTitle": "企业级Web应用开发实战",
        "uploaderId": 2001,
        "uploaderName": "李导师",
        "title": "项目实践案例",
        "description": "企业实际项目案例分析",
        "resourceType": "document",
        "fileUrl": "https://example.com/storage/resources/102.pdf",
        "fileSize": 3145728,
        "downloadCount": 3,
        "uploadTime": "2023-11-26T14:20:00"
      },
      // 更多资源记录...
    ],
    "total": 8,
    "size": 10,
    "current": 1,
    "pages": 1
  }
}
```

- **权限**: 课程相关人员

### 3.3 下载课程资源

- **请求方法**: GET
- **URL**: `/v1/course-resources/{resourceId}/download`
- **路径参数**:
  - `resourceId`: 资源ID

- **响应**: 文件流

- **权限**: 课程相关人员

### 3.4 删除课程资源

- **请求方法**: DELETE
- **URL**: `/v1/course-resources/{resourceId}`
- **路径参数**:
  - `resourceId`: 资源ID

- **响应**:

```typescript
{
  "code": 200,
  "message": "资源删除成功",
  "data": null
}
```

- **权限**: 资源上传者、课程教师、学校管理员

## 4. 评价管理接口

### 4.1 提交课程评价

- **请求方法**: POST
- **URL**: `/v1/course-ratings`
- **请求体**:

```typescript
{
  "courseId": 1,
  "rating": 5,
  "content": "这是一门非常实用的课程，理论与实践结合得很好，收获很大！"
}
```

- **响应**:

```typescript
{
  "code": 200,
  "message": "评价提交成功",
  "data": {
    "id": 201,
    "courseId": 1,
    "courseTitle": "企业级Web应用开发实战",
    "studentId": 3001,
    "studentName": "王学生",
    "rating": 5,
    "content": "这是一门非常实用的课程，理论与实践结合得很好，收获很大！",
    "createdAt": "2023-12-20T16:45:00",
    "updatedAt": "2023-12-20T16:45:00"
  }
}
```

- **权限**: 已完成课程的学生

### 4.2 获取课程评价列表

- **请求方法**: GET
- **URL**: `/v1/course-ratings/course/{courseId}`
- **路径参数**:
  - `courseId`: 课程ID
- **查询参数**:
  - `page`: 页码，默认1
  - `size`: 每页记录数，默认10

- **响应**:

```typescript
{
  "code": 200,
  "message": "success",
  "data": {
    "records": [
      {
        "id": 201,
        "courseId": 1,
        "courseTitle": "企业级Web应用开发实战",
        "studentId": 3001,
        "studentName": "王学生",
        "rating": 5,
        "content": "这是一门非常实用的课程，理论与实践结合得很好，收获很大！",
        "createdAt": "2023-12-20T16:45:00",
        "updatedAt": "2023-12-20T16:45:00"
      },
      {
        "id": 202,
        "courseId": 1,
        "courseTitle": "企业级Web应用开发实战",
        "studentId": 3002,
        "studentName": "李学生",
        "rating": 4,
        "content": "老师和导师讲解很清晰，案例丰富，但项目实践时间有些紧张。",
        "createdAt": "2023-12-21T09:30:00",
        "updatedAt": "2023-12-21T09:30:00"
      },
      // 更多评价记录...
    ],
    "total": 15,
    "size": 10,
    "current": 1,
    "pages": 2
  }
}
```

- **权限**: 所有用户

### 4.3 获取课程平均评分

- **请求方法**: GET
- **URL**: `/v1/course-ratings/average/{courseId}`
- **路径参数**:
  - `courseId`: 课程ID

- **响应**:

```typescript
{
  "code": 200,
  "message": "success",
  "data": 4.6
}
```

- **权限**: 所有用户

### 4.4 检查学生是否已评价课程

- **请求方法**: GET
- **URL**: `/v1/course-ratings/check/{courseId}`
- **路径参数**:
  - `courseId`: 课程ID

- **响应**:

```typescript
{
  "code": 200,
  "message": "success",
  "data": true  // 或 false
}
```

- **权限**: 学生

## 5. 用户相关接口

### 5.1 搜索用户

- **请求方法**: GET
- **URL**: `/v1/auth/search`
- **查询参数**:
  - `keyword`: 搜索关键词（邮箱或手机号）

- **响应**:

```typescript
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 2001,
    "account": "mentor_li",
    "nickname": "李导师",
    "email": "mentor@example.com",
    "phone": "13800138000",
    "role": "MENTOR",
    "organizationId": 4001,
    "organizationName": "XX科技有限公司",
    "verified": true,
    "avatarUrl": "https://example.com/avatars/2001.jpg",
    "status": "active"
  }
}
```

- **权限**: 教师、学校管理员

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 409 | 资源冲突 |
| 500 | 服务器内部错误 |

## 特殊情况处理

1. **课程已满**: 当学生尝试报名一个已达到最大学生人数的课程时，返回409错误。
2. **重复报名**: 当学生尝试重复报名同一课程时，返回409错误。
3. **课程状态限制**: 只有状态为"open"的课程才允许学生报名，否则返回400错误。
4. **资源不存在**: 当尝试访问不存在的资源时，返回404错误。
5. **权限验证**: 当用户尝试执行没有权限的操作时，返回403错误。

## API调用示例

### 创建课程示例

```javascript
// 前端调用示例
async function createCourse() {
  const courseData = {
    title: "企业级Web应用开发实战",
    description: "课程描述...",
    mentorId: 2001,
    scheduledTime: "2023-12-01T09:00:00",
    maxStudents: 30,
    location: "线上+XX大学教学楼B201",
    courseType: "hybrid"
  };
  
  try {
    const response = await fetch('/v1/dual-courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + userToken
      },
      body: JSON.stringify(courseData)
    });
    
    const result = await response.json();
    
    if (result.code === 200) {
      console.log('课程创建成功:', result.data);
      return result.data;
    } else {
      console.error('课程创建失败:', result.message);
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('API调用异常:', error);
    throw error;
  }
}
```

### 学生报名课程示例

```javascript
// 前端调用示例
async function enrollCourse(courseId) {
  try {
    const response = await fetch('/v1/dual-courses/enroll', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + userToken
      },
      body: JSON.stringify({ courseId })
    });
    
    const result = await response.json();
    
    if (result.code === 200) {
      console.log('报名成功');
      return true;
    } else {
      console.error('报名失败:', result.message);
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('API调用异常:', error);
    throw error;
  }
}
``` 