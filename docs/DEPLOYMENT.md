# 部署流程文档

## 修订历史

| 版本 | 日期 | 作者 | 变更说明 |
|------|------|------|----------|
| 1.0 | 2026-03-21 | 技术部 | 初始版本 |

## 1. 环境要求

### 1.1 服务器配置

**最低配置**:
- CPU: 2 核
- 内存：4GB
- 硬盘：40GB SSD
- 网络：100Mbps

**推荐配置**:
- CPU: 4 核
- 内存：8GB
- 硬盘：100GB SSD
- 网络：1Gbps

### 1.2 软件要求

- **操作系统**: Ubuntu 20.04 LTS / CentOS 8
- **Node.js**: 18.x LTS
- **MongoDB**: 6.0+
- **Nginx**: 1.18+
- **Git**: 2.20+

### 1.3 依赖服务

- **数据库**: MongoDB (本地或云数据库)
- **缓存**: Redis (可选，推荐)
- **对象存储**: 本地存储或云存储

## 2. 部署前准备

### 2.1 系统初始化

```bash
# 更新系统包
sudo apt update && sudo apt upgrade -y

# 安装必要工具
sudo apt install -y git curl wget build-essential

# 创建应用用户
sudo useradd -m -s /bin/bash stdmaterial
sudo mkdir -p /var/www/html/stdmaterial.com
sudo chown -R stdmaterial:stdmaterial /var/www/html/stdmaterial.com
```

### 2.2 安装 Node.js

```bash
# 使用 NodeSource 安装 Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 验证安装
node --version
npm --version
```

### 2.3 安装 MongoDB

```bash
# 导入 MongoDB GPG 密钥
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# 添加 MongoDB 仓库
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# 安装 MongoDB
sudo apt update
sudo apt install -y mongodb-org

# 启动 MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# 验证状态
sudo systemctl status mongod
```

### 2.4 安装 Nginx

```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

## 3. 应用部署

### 3.1 代码部署

```bash
# 切换到应用目录
cd /var/www/html/stdmaterial.com

# 克隆代码 (或使用 SCP 上传)
git clone <repository-url> .

# 或者从备份恢复
# unzip backup.zip -d .

# 安装依赖
npm install

# 安装管理后台依赖
cd admin
npm install
cd ..
```

### 3.2 环境配置

创建环境变量文件 `.env`:

```bash
# 服务器配置
NODE_ENV=production
PORT=3001

# 数据库配置
MONGODB_URI=mongodb://localhost:27017/stdmaterial

# 认证配置
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d
SESSION_SECRET=your-session-secret-change-this

# 文件上传配置
UPLOAD_PATH=/var/www/html/stdmaterial.com/uploads
MAX_FILE_SIZE=10485760

# 邮件配置 (可选)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=noreply@stdmaterial.com
SMTP_PASS=your-smtp-password

# 第三方服务 (可选)
GOOGLE_ANALYTICS_ID=UA-XXXXX-Y
```

设置文件权限:

```bash
chmod 600 .env
chown stdmaterial:stdmaterial .env
```

### 3.3 构建前端

```bash
# 构建主站前端
npm run build

# 构建管理后台
cd admin
npm run build
cd ..
```

### 3.4 数据库初始化

```bash
# 连接 MongoDB
mongosh

# 创建数据库和使用
use stdmaterial

# 创建索引
db.products.createIndex({ slug: 1 }, { unique: true });
db.products.createIndex({ name: "text", description: "text" });
db.categories.createIndex({ slug: 1 }, { unique: true });
db.customers.createIndex({ email: 1 }, { unique: true });
db.orders.createIndex({ orderNumber: 1 }, { unique: true });

# 创建初始管理员账户
db.customers.insertOne({
  email: "admin@stdmaterial.com",
  password: "$2b$10$...",  // 使用 bcrypt 加密的密码
  name: "System Administrator",
  role: "super_admin",
  status: "active",
  createdAt: new Date()
});
```

## 4. 进程管理

### 4.1 安装 PM2

```bash
sudo npm install -g pm2
```

### 4.2 配置 PM2

创建 `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: 'stdmaterial-api',
      script: './src/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      error_file: './logs/api-error.log',
      out_file: './logs/api-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      max_memory_restart: '500M',
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s'
    },
    {
      name: 'stdmaterial-admin',
      cwd: './admin',
      script: 'npm',
      args: 'run dev',
      env: {
        NODE_ENV: 'production',
        PORT: 3002
      }
    }
  ]
};
```

### 4.3 启动应用

```bash
# 启动所有应用
pm2 start ecosystem.config.js

# 保存 PM2 配置
pm2 save

# 设置开机自启
pm2 startup
# 执行输出的命令
```

### 4.4 PM2 常用命令

```bash
# 查看状态
pm2 status

# 查看日志
pm2 logs

# 重启应用
pm2 restart all

# 停止应用
pm2 stop all

# 删除应用
pm2 delete all

# 监控
pm2 monit
```

## 5. Nginx 配置

### 5.1 创建配置文件

```bash
sudo nano /etc/nginx/sites-available/stdmaterial.com
```

### 5.2 Nginx 配置内容

```nginx
server {
    listen 80;
    server_name stdmaterial.com www.stdmaterial.com;
    
    # 重定向到 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name stdmaterial.com www.stdmaterial.com;
    
    # SSL 配置
    ssl_certificate /etc/letsencrypt/live/stdmaterial.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/stdmaterial.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    # 安全头
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # 日志
    access_log /var/log/nginx/stdmaterial-access.log;
    error_log /var/log/nginx/stdmaterial-error.log;
    
    # 前端静态文件
    location / {
        root /var/www/html/stdmaterial.com/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
        
        # 缓存静态资源
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # API 代理
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # 限流
        limit_req zone=api_limit burst=20 nodelay;
    }
    
    # 管理后台
    location /admin {
        root /var/www/html/stdmaterial.com/admin;
        index index.html;
        try_files $uri $uri/ /admin/index.html;
        
        # 访问控制 (可选)
        # auth_basic "Admin Area";
        # auth_basic_user_file /etc/nginx/.htpasswd;
    }
    
    # 上传文件
    location /uploads {
        alias /var/www/html/stdmaterial.com/uploads;
        expires 30d;
        add_header Cache-Control "public";
        
        # 禁止执行脚本
        location ~ \.(php|html|htm|shtml|asp|aspx|jsp|cgi|bat|pl|dll)$ {
            deny all;
        }
    }
    
    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml application/javascript application/json;
    gzip_disable "MSIE [1-6]\.";
}

# 限流配置
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
```

### 5.3 启用配置

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/stdmaterial.com /etc/nginx/sites-enabled/

# 删除默认配置
sudo rm /etc/nginx/sites-enabled/default

# 测试配置
sudo nginx -t

# 重载 Nginx
sudo systemctl reload nginx
```

## 6. SSL 证书配置

### 6.1 安装 Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 6.2 获取证书

```bash
sudo certbot --nginx -d stdmaterial.com -d www.stdmaterial.com
```

### 6.3 自动续期

```bash
# 测试自动续期
sudo certbot renew --dry-run

# 添加定时任务 (已自动配置)
sudo systemctl status certbot.timer
```

## 7. 监控和日志

### 7.1 应用监控

**PM2 监控**:
```bash
pm2 monit
```

**系统监控**:
```bash
# 安装 htop
sudo apt install -y htop

# 查看系统资源
htop
```

### 7.2 日志管理

**应用日志**:
```bash
# 查看 API 日志
tail -f /var/www/html/stdmaterial.com/logs/api-error.log
tail -f /var/www/html/stdmaterial.com/logs/api-out.log

# 使用 PM2 查看
pm2 logs stdmaterial-api
```

**Nginx 日志**:
```bash
# 访问日志
tail -f /var/log/nginx/stdmaterial-access.log

# 错误日志
tail -f /var/log/nginx/stdmaterial-error.log
```

**系统日志**:
```bash
# MongoDB 日志
tail -f /var/log/mongodb/mongod.log

# Nginx 日志
tail -f /var/log/nginx/error.log
```

### 7.3 日志轮转

创建 `/etc/logrotate.d/stdmaterial`:

```
/var/www/html/stdmaterial.com/logs/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 0640 stdmaterial stdmaterial
    postrotate
        pm2 reload stdmaterial-api > /dev/null
    endscript
}
```

## 8. 备份策略

### 8.1 数据库备份

创建备份脚本 `/var/www/html/stdmaterial.com/scripts/backup.sh`:

```bash
#!/bin/bash

# 配置
BACKUP_DIR="/var/backups/stdmaterial"
DATE=$(date +%Y%m%d_%H%M%S)
MONGODB_URI="mongodb://localhost:27017"
DB_NAME="stdmaterial"

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份数据库
mongodump --uri=$MONGODB_URI --db=$DB_NAME --out=$BACKUP_DIR/db_$DATE

# 备份上传文件
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz /var/www/html/stdmaterial.com/uploads

# 删除 7 天前的备份
find $BACKUP_DIR -name "db_*" -mtime +7 -delete
find $BACKUP_DIR -name "uploads_*" -mtime +7 -delete

echo "Backup completed: $DATE"
```

设置定时任务:

```bash
# 编辑 crontab
crontab -e

# 添加每天凌晨 2 点备份
0 2 * * * /var/www/html/stdmaterial.com/scripts/backup.sh >> /var/log/stdmaterial-backup.log 2>&1
```

### 8.2 远程备份

```bash
# 使用 rsync 备份到远程服务器
rsync -avz /var/backups/stdmaterial user@backup-server:/backups/stdmaterial
```

## 9. CI/CD 配置 (可选)

### 9.1 GitHub Actions 配置

创建 `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm install
    
    - name: Build
      run: npm run build
    
    - name: Deploy to server
      uses: easingthemes/ssh-deploy@v3
      with:
        SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
        REMOTE_HOST: ${{ secrets.SERVER_HOST }}
        REMOTE_USER: stdmaterial
        SOURCE: "dist/"
        TARGET: "/var/www/html/stdmaterial.com/dist"
        SCRIPT_AFTER: |
          pm2 restart stdmaterial-api
```

## 10. 回滚方案

### 10.1 代码回滚

```bash
# 使用 Git 回滚
cd /var/www/html/stdmaterial.com
git revert HEAD
git push origin main

# 重新构建和部署
npm install
npm run build
pm2 restart all
```

### 10.2 数据库回滚

```bash
# 从备份恢复
mongorestore --uri=mongodb://localhost:27017 --db=stdmaterial /var/backups/stdmaterial/db_YYYYMMDD_HHMMSS/stdmaterial
```

### 10.3 快速回滚脚本

创建 `scripts/rollback.sh`:

```bash
#!/bin/bash

# 回滚到上一个版本
cd /var/www/html/stdmaterial.com
git reset --hard HEAD~1
npm install
npm run build
pm2 restart all

echo "Rollback completed"
```

## 11. 性能优化

### 11.1 系统优化

```bash
# 增加文件描述符限制
ulimit -n 65535

# 优化 TCP 设置
echo "net.core.somaxconn = 65535" >> /etc/sysctl.conf
echo "net.ipv4.tcp_max_syn_backlog = 65535" >> /etc/sysctl.conf
sysctl -p
```

### 11.2 MongoDB 优化

```javascript
// 配置 MongoDB 内存限制
// /etc/mongod.conf
storage:
  wiredTiger:
    engineConfig:
      cacheSizeGB: 2

// 重启 MongoDB
sudo systemctl restart mongod
```

### 11.3 Nginx 优化

```nginx
# 增加 worker 进程
worker_processes auto;

# 增加连接数
events {
    worker_connections 4096;
}

# 开启缓存
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:100m max_size=1g inactive=60m use_temp_path=off;
```

## 12. 故障排查

### 12.1 常见问题

**应用无法启动**:
```bash
# 检查端口占用
netstat -tulpn | grep :3001

# 检查 PM2 日志
pm2 logs stdmaterial-api

# 检查系统资源
free -h
df -h
```

**数据库连接失败**:
```bash
# 检查 MongoDB 状态
sudo systemctl status mongod

# 检查 MongoDB 日志
tail -f /var/log/mongodb/mongod.log

# 测试连接
mongosh mongodb://localhost:27017/stdmaterial
```

**Nginx 错误**:
```bash
# 测试配置
sudo nginx -t

# 查看错误日志
tail -f /var/log/nginx/error.log

# 重载配置
sudo nginx -s reload
```

---

**文档维护**: 技术部  
**最后更新**: 2026-03-21  
**下次审查**: 2026-06-21
