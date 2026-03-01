import paramiko
import os
import time

# 服务器信息
server_ip = "106.54.15.123"
username = "root"
password = "Fenix1983@"

# 本地和远程文件路径
local_zip = "wistailor_deployment.zip"
remote_zip = "/root/wistailor_deployment.zip"
remote_dir = "/var/www/html"

print("=== 开始部署到云服务器 ===")

# 1. 连接服务器
try:
    print(f"1. 连接到服务器 {server_ip}...")
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(server_ip, username=username, password=password, timeout=30)
    print("✓ 服务器连接成功")
    
    # 2. 上传文件
    print(f"2. 上传文件 {local_zip}...")
    sftp = client.open_sftp()
    sftp.put(local_zip, remote_zip)
    sftp.close()
    print("✓ 文件上传成功")
    
    # 3. 执行服务器命令
    def execute_command(cmd):
        stdin, stdout, stderr = client.exec_command(cmd)
        exit_status = stdout.channel.recv_exit_status()
        output = stdout.read().decode('utf-8')
        error = stderr.read().decode('utf-8')
        return exit_status, output, error
    
    # 4. 创建web目录
    print("3. 创建web目录...")
    execute_command(f"mkdir -p {remote_dir}")
    
    # 5. 解压文件
    print("4. 解压文件...")
    execute_command(f"unzip -o {remote_zip} -d {remote_dir}")
    
    # 6. 安装Nginx（如果未安装）
    print("5. 检查并安装Nginx...")
    status, output, error = execute_command("which nginx")
    if status != 0:
        print("  Nginx未安装，开始安装...")
        execute_command("apt update && apt install -y nginx")
    else:
        print("  Nginx已安装")
    
    # 7. 配置Nginx
    print("6. 配置Nginx...")
    nginx_config = '''
server {
    listen 80;
    server_name _;
    
    root /var/www/html;
    index index.html index.htm;
    
    location / {
        try_files $uri $uri/ =404;
    }
    
    location /admin {
        try_files $uri $uri/ =404;
    }
    
    location /assets {
        try_files $uri $uri/ =404;
    }
    
    location /data {
        try_files $uri $uri/ =404;
    }
}
'''
    
    # 写入Nginx配置文件
    sftp = client.open_sftp()
    with sftp.file('/etc/nginx/sites-available/default', 'w') as f:
        f.write(nginx_config)
    sftp.close()
    
    # 8. 重启Nginx
    print("7. 重启Nginx服务...")
    execute_command("systemctl restart nginx")
    
    # 9. 检查服务状态
    print("8. 检查Nginx服务状态...")
    status, output, error = execute_command("systemctl status nginx | grep Active")
    print(f"  状态: {output.strip()}")
    
    # 10. 验证部署
    print("9. 验证部署...")
    status, output, error = execute_command(f"ls -la {remote_dir}")
    print(f"  部署目录文件:")
    print(output[:500] + "..." if len(output) > 500 else output)
    
    # 11. 清理临时文件
    print("10. 清理临时文件...")
    execute_command(f"rm -f {remote_zip}")
    
    print("\n=== 部署完成！===\n")
    print(f"网站地址: http://{server_ip}")
    print(f"管理后台: http://{server_ip}/admin/dashboard.html")
    
finally:
    if 'client' in locals() and client:
        client.close()
        print("✓ 服务器连接已关闭")

print("=== 部署脚本执行完毕 ===")
