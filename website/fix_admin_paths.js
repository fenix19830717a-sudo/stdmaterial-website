// 批量修复admin页面中的路径问题
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const adminDir = path.join(__dirname, 'admin');

// 读取admin目录中的所有HTML文件
const files = fs.readdirSync(adminDir).filter(file => file.endsWith('.html'));

console.log('Found admin HTML files:', files);

// 修复每个文件中的路径
files.forEach(file => {
  const filePath = path.join(adminDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 修复相对路径为绝对路径
  const fixedContent = content
    // 修复登录页面的重定向
    .replace(/window\.location\.href = "login\.html";/g, 'window.location.href = "/admin/login.html";')
    // 修复dashboard页面的重定向
    .replace(/window\.location\.href = "dashboard\.html";/g, 'window.location.href = "/admin/dashboard.html";')
    // 修复其他相对路径
    .replace(/href="([a-zA-Z0-9-]+\.html)"/g, 'href="/admin/$1"')
    .replace(/src="assets\/js\//g, 'src="/admin/assets/js/')
    .replace(/href="assets\/css\//g, 'href="/admin/assets/css/');
  
  // 写回修复后的内容
  fs.writeFileSync(filePath, fixedContent);
  console.log(`Fixed: ${file}`);
});

console.log('All admin pages have been fixed!');
