#!/bin/bash

# 部署脚本 for 研磨设备B2B独立站

echo "=== 开始部署研磨设备B2B独立站 ==="

# 1. 更新系统
echo "1. 更新系统..."
sudo apt update && sudo apt upgrade -y

# 2. 安装必要的依赖
echo "2. 安装必要的依赖..."
sudo apt install -y docker.io docker-compose git curl wget unzip nginx
sudo systemctl enable docker
sudo systemctl start docker

# 3. 克隆项目代码
echo "3. 克隆项目代码..."
if [ ! -d "/opt/grinding-equipment-b2b" ]; then
    git clone https://github.com/yourusername/grinding-equipment-b2b.git /opt/grinding-equipment-b2b
else
    cd /opt/grinding-equipment-b2b
    git pull
fi

# 4. 创建目录结构
echo "4. 创建目录结构..."
cd /opt/grinding-equipment-b2b
mkdir -p openclaw/config openclaw/data openclaw/logs nginx website

# 5. 复制配置文件
echo "5. 复制配置文件..."
cp openclaw-config.yaml openclaw/config/config.yaml
cp docker-compose.yml .
cp nginx.conf nginx/

# 6. 复制网站文件
echo "6. 复制网站文件..."
cp -r *.html website/
cp -r *.css website/ 2>/dev/null
cp -r *.js website/ 2>/dev/null
cp -r images website/ 2>/dev/null

# 7. 启动Docker容器
echo "7. 启动Docker容器..."
docker-compose up -d

# 8. 配置Nginx
echo "8. 配置Nginx..."
sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sf /opt/grinding-equipment-b2b/nginx/nginx.conf /etc/nginx/sites-enabled/grinding-equipment-b2b.conf
sudo nginx -t
sudo systemctl restart nginx

# 9. 配置防火墙
echo "9. 配置防火墙..."
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 22
sudo ufw reload

# 10. 显示部署信息
echo "=== 部署完成 ==="
echo "网站地址: http://$(curl -s ifconfig.me)"
echo "OpenClaw API: http://$(curl -s ifconfig.me):8080"
echo ""
echo "=== 后续步骤 ==="
echo "1. 访问网站地址查看部署结果"
echo "2. 访问OpenClaw API查看AI agent状态"
echo "3. 登录管理后台配置产品和内容"
echo ""
echo "=== 部署脚本执行完成 ==="
