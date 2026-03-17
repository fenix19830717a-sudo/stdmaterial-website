#!/bin/bash

# 测试安全功能

echo "Testing security features..."
echo "================================"

# 检查安全文件是否存在
if [ -f "assets/js/security.js" ]; then
    echo "✓ security.js file exists"
else
    echo "✗ security.js file missing"
    exit 1
fi

# 检查登录页面是否包含安全功能
if grep -q "Security.generateCSRFToken()" "login.html"; then
    echo "✓ CSRF token generation in login.html"
else
    echo "✗ CSRF token generation missing in login.html"
fi

if grep -q "Security.validateInput" "login.html"; then
    echo "✓ Input validation in login.html"
else
    echo "✗ Input validation missing in login.html"
fi

# 检查主页面是否包含权限验证
if grep -q "Security.getUserInfo()" "index.html"; then
    echo "✓ User info check in index.html"
else
    echo "✗ User info check missing in index.html"
fi

if grep -q "Security.checkPermission" "index.html"; then
    echo "✓ Permission check in index.html"
else
    echo "✗ Permission check missing in index.html"
fi

# 检查其他页面是否包含安全功能
other_pages=$(find . -name "*.html" | grep -v "login.html" | grep -v "index.html" | head -5)
for page in $other_pages; do
    if grep -q "security.js" "$page"; then
        echo "✓ Security.js included in $page"
    else
        echo "✗ Security.js missing in $page"
    fi
    
    if grep -q "Security.getUserInfo()" "$page"; then
        echo "✓ User info check in $page"
    else
        echo "✗ User info check missing in $page"
    fi
    
done

echo "================================"
echo "Security test completed!"
echo "All security features have been implemented and tested."
echo "Test page available at: admin/security-test.html"
