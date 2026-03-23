# StdMaterial 生产部署指南

## 项目概述
- **项目路径**: `/var/www/html/stdmaterial.com`
- **源代码路径**: `/var/www/html/stdmaterial.com/stdmaterial-rewrite`
- **技术栈**: React + TypeScript + Vite

## 已完成的部署工作

### 1. Docker 清理
- ✅ 已删除 `docker-compose.yml`
- ✅ 已删除 `apps/web/Dockerfile`

### 2. 代码修复
- ✅ 修复了截断的 `labMillsProducts.ts` 文件
- ✅ 修复了截断的 `imageMap.ts` 文件
- ✅ 修复了所有 TypeScript 编译错误
- ✅ 修复了 `ProductDetailPage.tsx` 类型不匹配问题

### 3. 数据存储方案
- **当前方案**: 使用静态 TypeScript/JSON 文件（推荐，避免大文件卡死问题）
- **备选方案**: MongoDB 数据库（已创建模型和 API 路由，可选使用）

### 4. 构建与部署
- ✅ 前端构建成功
- ✅ 构建文件已部署到 `/var/www/html/stdmaterial.com/dist/`

## 产品数据管理

### 当前方案：静态文件存储
产品数据存储在：
- `/var/www/html/stdmaterial.com/stdmaterial-rewrite/apps/web/src/data/labMillsProducts.ts`
- `/var/www/html/stdmaterial.com/stdmaterial-rewrite/apps/web/src/data/products/imageMap.ts`

### 备选方案：MongoDB 数据库
如需使用数据库，可执行以下步骤：

1. 确保 MongoDB 运行
2. 运行迁移脚本：
   ```bash
   cd /var/www/html/stdmaterial.com/stdmaterial-rewrite/apps/web
   pnpm migrate
   ```
3. 启动后端服务：
   ```bash
   pnpm server
   ```

## 构建和部署流程

### 重新构建和部署
```bash
cd /var/www/html/stdmaterial.com/stdmaterial-rewrite

# 安装依赖（如需要）
pnpm install

# 构建项目
pnpm build

# 部署到 Nginx
rm -rf /var/www/html/stdmaterial.com/dist
cp -r apps/web/dist /var/www/html/stdmaterial.com/
```

## Nginx 配置

### 配置文件位置
- 主要配置：`/etc/nginx/nginx.conf` 或 `/etc/nginx/sites-available/`
- 项目配置模板：`/var/www/html/stdmaterial.com/nginx.conf`（可选）

### 基本 Nginx 配置示例
```nginx
server {
    listen 80;
    server_name stdmaterial.com www.stdmaterial.com;
    
    root /var/www/html/stdmaterial.com;
    index index.html;
    
    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;
    
    # 静态文件缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|webp|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # React SPA 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 项目文件结构

```
/var/www/html/stdmaterial.com/
├── dist/                          # 生产构建文件
│   ├── index.html
│   └── assets/
├── stdmaterial-rewrite/            # 源代码
│   ├── apps/web/
│   │   ├── src/
│   │   │   ├── data/              # 产品数据
│   │   │   ├── pages/
│   │   │   └── components/
│   │   └── dist/                  # 构建输出
│   ├── packages/
│   └── deploy.sh                 # 部署脚本
├── data/                          # 旧版本数据备份
├── docs/                          # 项目文档
└── nginx.conf                     # Nginx 配置模板
```

## 常见问题

### 1. 如何更新产品数据？
编辑 `/var/www/html/stdmaterial.com/stdmaterial-rewrite/apps/web/src/data/labMillsProducts.ts`，然后重新构建并部署。

### 2. 如何重新构建？
按照"构建和部署流程"部分执行。

### 3. 大文件卡死问题？
使用当前的静态文件方案，避免使用数据库（除非确实需要）。

### 4. 项目使用什么包管理器？
使用 `pnpm`，不要混用 `npm` 或 `yarn`。
