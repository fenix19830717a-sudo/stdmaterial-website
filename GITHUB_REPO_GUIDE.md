# GitHub 仓库说明

## 仓库内容

本仓库只包含 **独立站主框架代码**，不包括运营过程数据。

### ✅ 包含的内容
- 前端页面代码 (HTML/CSS/JS)
- 管理后台代码
- API 服务代码
- 配置文件 (nginx, docker-compose)
- 文档 (docs/)
- 脚本工具 (scripts/)

### ❌ 不包含的内容
- **产品数据** - 位于 `data/products.json` (运营数据，本地维护)
- **产品图片** - 位于 `products-images/` (大文件，本地存储)
- **下载备份** - 位于 `downloads/` (临时文件)
- **数据库文件** - SQLite/MySQL 数据
- **日志文件** - `*.log`
- **Node 模块** - `node_modules/`

## 部署说明

### 首次部署
```bash
# 1. 克隆代码
git clone https://github.com/fenix19830717a-sudo/stdmaterial-website.git

# 2. 安装依赖
cd stdmaterial-website/api
npm install

# 3. 配置环境
# 复制 .env.example 为 .env 并配置

# 4. 启动服务
docker-compose up -d
```

### 数据同步
产品数据、图片等运营数据需要通过其他方式同步：
- **方式1**: 从原服务器 SCP 复制 `data/` 和 `products-images/`
- **方式2**: 重新抓取货源网站产品数据

## 目录结构

```
stdmaterial.com/
├── admin/           # 管理后台代码 ✅
├── api/            # API 服务代码 ✅
├── assets/         # 静态资源 (CSS/JS) ✅
├── data/           # 产品数据 ❌ (运营数据)
├── docs/           # 文档 ✅
├── products-images/ # 产品图片 ❌ (大文件)
├── downloads/      # 下载备份 ❌ (临时文件)
├── scripts/        # 脚本工具 ✅
├── index.html      # 首页 ✅
├── docker-compose.yml # Docker 配置 ✅
└── nginx.conf      # Nginx 配置 ✅
```

## 注意事项

1. **不要提交大文件** - 已配置 .gitignore 忽略图片和数据库
2. **敏感信息** - API 密钥、密码等使用环境变量
3. **运营数据** - 产品、订单等数据定期备份在本地

## 更新代码

```bash
git pull origin master
# 重启服务
docker-compose restart
```
