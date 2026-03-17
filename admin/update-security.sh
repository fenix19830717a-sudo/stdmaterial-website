#!/bin/bash

# 为所有管理后台页面添加安全保护

# 要处理的文件列表
files=$(find . -name "*.html" | grep -v "login.html" | grep -v "index.html")

# 为每个文件添加安全保护
for file in $files; do
    echo "Processing $file..."
    
    # 添加security.js引用
    if ! grep -q "security.js" $file; then
        sed -i '/<script src="https:\/\/cdn.tailwindcss.com"/a \    <script src="assets/js/security.js"></script>' $file
    fi
    
    # 添加权限验证逻辑
    if ! grep -q "Security.getUserInfo()" $file; then
        # 找到第一个<script>标签并在其后添加权限验证
        sed -i '/<script>/a \\n        // 权限验证\n        document.addEventListener("DOMContentLoaded", function() {\n            // 检查用户是否已登录\n            const userInfo = Security.getUserInfo();\n            if (!userInfo) {\n                window.location.href = "login.html";\n                return;\n            }\n            \n            // 检查用户权限\n            if (!Security.checkPermission("user")) {\n                window.location.href = "login.html";\n                return;\n            }\n        });\n        \n        // 登出功能\n        function logout() {\n            Security.clearUserInfo();\n            window.location.href = "login.html";\n        }' $file
    fi
    
    # 更新登出链接
    if grep -q 'href="login.html"' $file && grep -q 'Logout' $file; then
        sed -i 's/href="login.html"/href="#" onclick="logout()"/g' $file
    fi
    
    echo "Updated $file"
done

echo "Security updates completed!"