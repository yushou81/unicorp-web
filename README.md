# UniCorp Web平台

基于 Vue 3 + TypeScript + Vite 构建的现代化校企合作平台。

## 🚀 技术栈

- **前端框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **开发语言**: TypeScript
- **样式框架**: Tailwind CSS
- **路由管理**: Vue Router 4
- **状态管理**: Pinia
- **UI组件**: 自定义组件库 + Heroicons
- **网络请求**: 基于Fetch API的封装
- **表单验证**: 自定义验证

## 📁 项目结构

```
unicorp-web/
├── src/
│   ├── assets/          # 静态资源
│   ├── components/      # 组件
│   │   ├── classroom/   # 双师课堂相关组件
│   │   ├── dashboard/   # 仪表盘组件
│   │   ├── home/        # 首页组件
│   │   ├── job/         # 招聘相关组件
│   │   ├── layout/      # 布局组件
│   │   ├── resume/      # 简历相关组件
│   │   └── ui/          # UI基础组件
│   ├── lib/             # 工具函数和API
│   │   ├── api/         # API服务封装
│   │   │   ├── apiClient.ts    # API客户端封装
│   │   │   ├── auth.ts         # 认证相关API
│   │   │   ├── classroom.ts    # 双师课堂API
│   │   │   ├── job.ts          # 招聘相关API
│   │   │   ├── resume.ts       # 简历相关API
│   │   │   ├── admin.ts        # 管理员API
│   │   │   ├── schoolAdmin.ts  # 学校管理员API
│   │   │   └── enterpriseAdmin.ts # 企业管理员API
│   │   ├── directives/  # Vue指令
│   │   └── utils.ts     # 通用工具函数
│   ├── router/          # 路由配置
│   ├── stores/          # 状态管理
│   ├── views/           # 页面组件
│   │   ├── admin/       # 管理后台
│   │   ├── classroom/   # 双师课堂页面
│   │   ├── dashboard/   # 仪表盘页面
│   │   ├── project/     # 项目相关页面
│   │   ├── ApplyView.vue    # 申请页面
│   │   ├── HomeView.vue     # 首页
│   │   ├── JobView.vue      # 职位列表
│   │   ├── JobDetailView.vue # 职位详情
│   │   ├── LearnView.vue    # 学习页面
│   │   ├── LoginView.vue    # 登录页面
│   │   ├── RegisterView.vue # 注册页面
│   │   ├── NotFound.vue     # 404页面
│   │   └── UserDashboardView.vue # 用户仪表盘
│   ├── App.vue          # 根组件
│   ├── main.ts          # 入口文件
│   └── env.d.ts         # 类型声明
├── docs/                # 项目文档
│   ├── 双师课堂功能设计文档.md     # 双师课堂功能设计
│   ├── 双师课堂API接口文档.md      # 双师课堂API文档
│   ├── 双师课堂前端实现计划.md     # 双师课堂前端实现计划
│   └── 双师课堂数据库设计.md       # 双师课堂数据库设计
├── index.html          # HTML模板
├── package.json        # 项目配置
├── vite.config.ts      # Vite配置
├── tailwind.config.ts  # Tailwind配置
├── tsconfig.json       # TypeScript配置
└── README.md           # 项目说明
```

## 🎯 功能模块

### 1. 用户认证
- 用户注册
- 用户登录
- 权限管理
- 个人信息管理

### 2. 招聘系统
- 职位发布与管理
- 职位搜索与筛选
- 简历投递
- 简历管理

### 3. 双师课堂
- 课程创建与管理
- 企业导师协作
- 学生报名与学习
- 课程资源管理
- 学习进度跟踪
- 课程评价

### 4. 用户仪表盘
- 学生仪表盘
- 教师仪表盘
- 企业导师仪表盘
- 学校管理员仪表盘
- 企业管理员仪表盘

### 5. 项目管理
- 项目发布
- 项目申请
- 项目协作
- 成果展示

## 🛠️ 开发环境

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

### 代码检查
```bash
npm run lint
```

## 🌟 主要特性

- **现代化架构**: 基于 Vue 3 Composition API
- **类型安全**: 完整的 TypeScript 支持
- **响应式设计**: 支持桌面端和移动端
- **组件化开发**: 可复用的 UI 组件库
- **状态管理**: 基于 Pinia 的响应式状态管理
- **路由管理**: 基于 Vue Router 的 SPA 路由
- **样式系统**: 基于 Tailwind CSS 的原子化 CSS
- **API封装**: 统一的API请求客户端
- **权限控制**: 基于角色的访问控制系统
- **文档完善**: 详细的功能设计和API文档

## 📱 浏览器支持

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

## 📖 文档

项目包含以下详细文档:

- **双师课堂功能设计文档**: 详细描述双师课堂功能的整体设计，包括用户角色、数据模型、API接口、页面设计等。
- **双师课堂API接口文档**: 详细描述双师课堂所有API接口的请求方法、参数和响应数据。
- **双师课堂前端实现计划**: 详细说明双师课堂前端实现的组件设计、状态管理和开发计划。
- **双师课堂数据库设计**: 详细描述双师课堂功能的数据库表设计、关系设计和优化策略。

## �� 许可证

MIT License 