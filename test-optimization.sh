#!/bin/bash

# Test script to verify optimization

echo "Testing stdmaterial.com optimization..."
echo "======================================"

# Check for Chinese content in key files
echo "\n1. Checking for Chinese content in key files:"
chinese_files=$(grep -r "[\u4e00-\u9fa5]" --include="*.html" --include="*.js" . | grep -v "node_modules" | grep -v ".git")

if [ -z "$chinese_files" ]; then
    echo "✓ No Chinese content found in key files"
else
    echo "✗ Chinese content found:"
    echo "$chinese_files"
fi

# Check navigation consistency
echo "\n2. Checking navigation consistency:"
nav_links=$(grep -r "<a.*href.*\.html" --include="*.html" . | grep -v "node_modules" | grep -v ".git" | sort | uniq)
echo "Navigation links found:"
echo "$nav_links"

# Check admin product management
echo "\n3. Checking admin product management:"
if [ -f "admin/products.html" ]; then
    echo "✓ Admin product management page exists"
    if grep -q "Product Images" admin/products.html; then
        echo "✓ Image upload functionality present"
    else
        echo "✗ Image upload functionality missing"
    fi
else
    echo "✗ Admin product management page missing"
fi

echo "\n4. Checking backup status:"
git_status=$(git status)
if echo "$git_status" | grep -q "nothing to commit"; then
    echo "✓ Backup is up to date"
else
    echo "✗ Backup needs to be updated"
fi

echo "\n======================================"
echo "Optimization test completed!"
