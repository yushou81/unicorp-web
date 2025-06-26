# 人力资源保障能力提升平台

基于 Vue 3 + TypeScript + Vite 构建的现代化人力资源管理系统。

## 🚀 技术栈

- **前端框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **开发语言**: TypeScript
- **样式框架**: Tailwind CSS
- **路由管理**: Vue Router 4
- **状态管理**: Pinia
- **UI组件**: 自定义组件库
- **图标库**: Lucide Vue Next
- **表单验证**: Vee-validate + Zod
- **通知系统**: Vue Sonner

## 📁 项目结构

```
hr-platform/
├── src/
│   ├── assets/          # 静态资源
│   │   └── main.css     # 全局样式
│   ├── components/      # 组件
│   │   └── ui/         # UI组件库
│   │       ├── Button.vue
│   │       ├── Card.vue
│   │       ├── CardHeader.vue
│   │       ├── CardTitle.vue
│   │       ├── CardDescription.vue
│   │       ├── CardContent.vue
│   │       └── Loading.vue
│   ├── lib/            # 工具函数和API
│   │   ├── utils.ts    # 通用工具函数
│   │   └── api.ts      # API服务封装
│   ├── router/         # 路由配置
│   │   └── index.ts
│   ├── stores/         # 状态管理
│   │   └── app.ts
│   ├── views/          # 页面组件
│   │   ├── HomeView.vue
│   │   ├── ApplyView.vue
│   │   ├── JobView.vue
│   │   ├── LearnView.vue
│   │   ├── NotFound.vue
│   │   └── admin/      # 管理后台
│   │       ├── AdminLayout.vue
│   │       ├── DashboardView.vue
│   │       └── OrganizationView.vue
│   ├── App.vue         # 根组件
│   ├── main.ts         # 入口文件
│   └── env.d.ts        # 类型声明
├── index.html          # HTML模板
├── package.json        # 项目配置
├── vite.config.ts      # Vite配置
├── tailwind.config.ts  # Tailwind配置
├── tsconfig.json       # TypeScript配置
└── README.md           # 项目说明
```

## 🎯 功能模块

### 1. 基础支撑
- 机构组织管理
- 权限管理
- 系统配置

### 2. 业务申报
- 资金补贴申请
- 培训补贴申请
- 社保补贴申请
- 申报记录管理

### 3. 招聘系统
- 职位发布
- 求职搜索
- 人才匹配
- 数据统计

### 4. 在线学习
- 课程管理
- 培训报名
- 学习记录
- 进度跟踪

### 5. 管理后台
- 数据仪表盘
- 机构管理
- 用户管理
- 系统监控

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
- **开发体验**: 热重载、TypeScript 支持、ESLint 配置

## 📱 浏览器支持

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

## �� 许可证

MIT License 