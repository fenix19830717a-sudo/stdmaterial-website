# 湖南盛通达材料科技官网

基于React的现代化Web应用，集成AI-powered功能，提供材料分析和研磨模拟器等专业工具。

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 项目文档

### 核心文档
- **[DESIGN.md](DESIGN.md)** - 设计文档，包含技术架构和设计原则
- **[ROADMAP.md](ROADMAP.md)** - 长期规划路线图，定义项目发展方向
- **[AGENTS.md](AGENTS.md)** - 开发代理指南，包含工作流程和最佳实践

### 架构文档
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - 详细的项目架构说明
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - 部署指南
- **[USER_GUIDE.md](USER_GUIDE.md)** - 用户使用指南

### 开发文档
- **[SIMULATOR_OPTIMIZATION_REPORT.md](SIMULATOR_OPTIMIZATION_REPORT.md)** - 模拟器优化报告

## 技术栈

### 前端
- React 19.2.4
- React Router 7.13.1
- Tailwind CSS 4.2.1
- Vite 8.0.0
- TypeScript 5.9.3

### 后端
- Express.js 5.2.1
- MongoDB 8.0.0

### AI集成
- OpenAI, DeepSeek, Anthropic, Silicon Flow

## 核心功能

1. **导航系统** - 响应式桌面和移动导航菜单
2. **产品目录** - 材料和产品浏览与搜索
3. **AI工具** - 代码生成、材料分析
4. **研磨模拟器** - 实时物理模拟和数据可视化
5. **多语言支持** - 英文和中文

## 开发工作流

### 模式A: 交互式开发
1. 阅读 [AGENTS.md](AGENTS.md) 了解项目结构
2. 运行 `npm install`
3. 启动开发服务器 `npm run dev`
4. 使用 `python dev-agent.py status` 检查状态
5. 使用 `python dev-agent.py next` 获取下一个功能
6. 实现功能并运行测试
7. 标记完成 `python dev-agent.py complete <id>`

### 模式B: 自动驾驶开发
```bash
python dev-agent.py run
```

### 无限循环开发
```bash
python dev-loop.py run
```

## 项目结构

```
├── src/                    # 源代码
│   ├── components/        # 可复用组件
│   ├── pages/            # 页面组件
│   ├── hooks/            # 自定义Hooks
│   ├── utils/            # 工具函数
│   ├── routes/           # 路由配置
│   └── types/            # 类型定义
├── assets/               # 静态资源
├── server/              # 后端代码
├── docs/                # 文档
└── tests/               # 测试文件
```

## 贡献指南

1. 阅读 [DESIGN.md](DESIGN.md) 了解设计原则
2. 遵循 [AGENTS.md](AGENTS.md) 中的开发流程
3. 确保代码通过 TypeScript 类型检查
4. 运行 `npm run build` 确保构建成功
5. 提交前运行代码检查

## 许可证

MIT License

---

*最后更新: 2026-03-25*
*版本: 2.0.0*