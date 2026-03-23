# 维护指南文档

## 修订历史

| 版本 | 日期 | 作者 | 变更说明 |
|------|------|------|----------|
| 1.0 | 2026-03-21 | 技术部 | 初始版本 |

## 1. 日常维护任务

### 1.1 每日检查清单

**系统健康检查** (每天上午 9:00):

```bash
# 1. 检查应用状态
pm2 status

# 2. 检查系统资源
free -h
df -h
uptime

# 3. 检查服务状态
sudo systemctl status nginx
sudo systemctl status mongod

# 4. 查看错误日志
pm2 logs stdmaterial-api --lines 50
tail -50 /var/log/nginx/error.log

# 5. 检查磁盘空间
df -h /var/www
df -h /var/log
```

**性能监控**:
- CPU 使用率 (< 70%)
- 内存使用率 (< 80%)
- 磁盘使用率 (< 85%)
- 网络带宽使用率
- 数据库连接数

**日志审查**:
- 应用错误日志
- Nginx 错误日志
- MongoDB 日志
- 系统日志

### 1.2 每周维护任务

**周一**:
- [ ] 审查上周错误日志
- [ ] 检查慢查询日志
- [ ] 清理临时文件
- [ ] 验证备份完整性

**周三**:
- [ ] 性能数据分析
- [ ] 用户反馈审查
- [ ] SEO 排名检查
- [ ] 安全检查 (SSL 证书、防火墙)

**周五**:
- [ ] 系统更新检查
- [ ] 依赖包安全更新
- [ ] 代码审查和合并
- [ ] 周报生成

### 1.3 每月维护任务

**第一周**:
- [ ] 数据库性能优化
- [ ] 索引优化和分析
- [ ] 数据归档
- [ ] 安全审计

**第二周**:
- [ ] 代码质量审查
- [ ] 技术债务评估
- [ ] 文档更新
- [ ] 团队培训

**第三周**:
- [ ] 灾难恢复演练
- [ ] 备份恢复测试
- [ ] 性能基准测试
- [ ] 容量规划

**第四周**:
- [ ] 月度报告生成
- [ ] KPI 分析
- [ ] 下月计划制定
- [ ] 系统升级规划

## 2. 故障排查指南

### 2.1 应用故障

**问题**: 应用无法访问

**排查步骤**:
```bash
# 1. 检查应用进程
pm2 status
pm2 describe stdmaterial-api

# 2. 查看应用日志
pm2 logs stdmaterial-api --lines 100

# 3. 检查端口
netstat -tulpn | grep 3001

# 4. 检查系统资源
top -bn1 | head -20
free -m

# 5. 重启应用
pm2 restart stdmaterial-api

# 6. 如果仍然失败，检查依赖服务
sudo systemctl status mongod
mongosh --eval "db.adminCommand('ping')"
```

**常见原因**:
- 内存溢出 → 增加 PM2 内存限制或优化代码
- 数据库连接失败 → 检查 MongoDB 状态
- 端口冲突 → 更改端口或停止冲突进程
- 依赖包问题 → 重新安装依赖

### 2.2 数据库故障

**问题**: MongoDB 连接失败

**排查步骤**:
```bash
# 1. 检查 MongoDB 服务状态
sudo systemctl status mongod

# 2. 查看 MongoDB 日志
tail -100 /var/log/mongodb/mongod.log

# 3. 检查磁盘空间
df -h /var/lib/mongodb

# 4. 检查内存使用
free -m

# 5. 尝试本地连接
mongosh --eval "db.adminCommand('ping')"

# 6. 检查连接数
mongosh --eval "db.serverStatus().connections"

# 7. 重启 MongoDB (谨慎操作)
sudo systemctl restart mongod
```

**常见问题**:
- 磁盘空间不足 → 清理日志或扩容
- 内存不足 → 增加内存或优化查询
- 连接数过多 → 优化连接池或增加限制
- 数据文件损坏 → 从备份恢复

### 2.3 Nginx 故障

**问题**: Nginx 无法访问或 502 错误

**排查步骤**:
```bash
# 1. 检查 Nginx 状态
sudo systemctl status nginx

# 2. 测试配置
sudo nginx -t

# 3. 查看错误日志
tail -100 /var/log/nginx/error.log

# 4. 检查上游服务
curl -I http://localhost:3001/api/health

# 5. 检查 SSL 证书
sudo certbot certificates

# 6. 重载配置
sudo nginx -s reload

# 7. 重启 Nginx
sudo systemctl restart nginx
```

**常见问题**:
- 配置错误 → 修复配置并测试
- 上游服务不可用 → 检查后端应用
- SSL 证书过期 → 续期证书
- 权限问题 → 检查文件权限

### 2.4 性能问题

**问题**: 网站响应慢

**排查步骤**:
```bash
# 1. 检查系统负载
uptime
top

# 2. 检查网络延迟
ping -c 4 stdmaterial.com

# 3. 检查数据库性能
mongosh --eval "db.currentOp()"

# 4. 检查慢查询
mongosh --eval "db.setProfilingLevel(2, 100)"

# 5. 检查缓存命中率
# 查看 Redis 统计 (如果使用)

# 6. 分析应用性能
pm2 monit

# 7. 使用 Chrome DevTools 分析前端性能
```

**优化措施**:
- 启用缓存 (Redis)
- 优化数据库查询
- 启用 CDN
- 压缩静态资源
- 减少 HTTP 请求
- 图片优化

## 3. 性能优化建议

### 3.1 前端优化

**图片优化**:
```bash
# 使用 WebP 格式
# 压缩图片
# 实现懒加载
# 使用响应式图片
```

**代码优化**:
- 启用代码分割
- 实现 Tree Shaking
- 压缩混淆代码
- 移除未使用代码

**缓存策略**:
```javascript
// Service Worker 缓存
// LocalStorage 缓存
// 浏览器缓存头设置
```

### 3.2 后端优化

**数据库优化**:
```javascript
// 1. 创建合适的索引
db.products.createIndex({ category: 1, status: 1 });

// 2. 使用投影减少返回字段
db.products.find({}, { name: 1, price: 1 });

// 3. 使用聚合管道优化查询
db.orders.aggregate([
  { $match: { status: 'completed' } },
  { $group: { _id: '$customer', total: { $sum: '$total' } } }
]);

// 4. 定期分析和优化集合
db.products.reIndex();
db.stats();
```

**API 优化**:
- 实现请求限流
- 启用响应压缩
- 使用缓存层
- 实现分页查询
- 避免 N+1 查询

### 3.3 服务器优化

**系统优化**:
```bash
# 1. 增加文件描述符限制
ulimit -n 65535

# 2. 优化 TCP 设置
cat >> /etc/sysctl.conf << EOF
net.core.somaxconn = 65535
net.ipv4.tcp_max_syn_backlog = 65535
net.ipv4.ip_local_port_range = 1024 65535
EOF
sysctl -p

# 3. 优化内存使用
echo "vm.swappiness = 1" >> /etc/sysctl.conf
sysctl -p
```

**Nginx 优化**:
```nginx
# 1. 增加 worker 进程
worker_processes auto;

# 2. 增加连接数
events {
    worker_connections 4096;
    multi_accept on;
}

# 3. 启用缓存
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:100m max_size=1g;

# 4. 优化缓冲区
proxy_buffer_size 128k;
proxy_buffers 4 256k;
proxy_busy_buffers_size 256k;
```

## 4. 安全维护

### 4.1 定期安全检查

**每周检查**:
- [ ] SSL 证书有效期
- [ ] 防火墙规则
- [ ] 系统漏洞扫描
- [ ] 异常登录尝试

**每月检查**:
- [ ] 依赖包安全更新
- [ ] 权限审查
- [ ] 安全日志审计
- [ ] 备份加密检查

### 4.2 安全更新流程

```bash
# 1. 检查可用更新
sudo apt update
npm audit

# 2. 评估更新影响
npm audit --audit-level=high

# 3. 在测试环境测试
# ...

# 4. 备份当前版本
git tag backup-$(date +%Y%m%d)
mongodump --db stdmaterial

# 5. 应用更新
sudo apt upgrade
npm update

# 6. 验证功能
# ...

# 7. 监控异常
pm2 logs
```

### 4.3 应急响应

**发现安全漏洞时**:

1. **立即响应** (0-1 小时):
   - 隔离受影响的系统
   - 保存日志和证据
   - 通知相关人员

2. **评估影响** (1-4 小时):
   - 确定漏洞范围
   - 评估数据泄露风险
   - 制定修复方案

3. **修复漏洞** (4-24 小时):
   - 应用安全补丁
   - 修改受影响配置
   - 重置相关凭证

4. **恢复服务** (24-48 小时):
   - 验证修复效果
   - 逐步恢复服务
   - 持续监控

5. **事后总结** (48-72 小时):
   - 编写事故报告
   - 改进安全措施
   - 团队分享学习

## 5. 监控告警

### 5.1 监控指标

**系统指标**:
- CPU 使用率 (阈值：80%)
- 内存使用率 (阈值：85%)
- 磁盘使用率 (阈值：85%)
- 网络带宽 (阈值：80%)

**应用指标**:
- 响应时间 (阈值：3 秒)
- 错误率 (阈值：1%)
- QPS (每秒查询数)
- 活跃连接数

**业务指标**:
- 日活跃用户
- 转化率
- 订单量
- 询盘数量

### 5.2 告警配置

**邮件告警**:
```javascript
// 配置邮件通知
const alertConfig = {
  cpu: { threshold: 80, duration: '5m' },
  memory: { threshold: 85, duration: '5m' },
  disk: { threshold: 85, duration: '1h' },
  errorRate: { threshold: 1, duration: '10m' }
};
```

**短信告警** (紧急情况):
- 系统宕机
- 数据库故障
- 安全事件
- 磁盘空间不足

### 5.3 监控工具

**系统监控**:
```bash
# 安装监控工具
sudo apt install -y htop iotop nethogs

# 使用 PM2 监控
pm2 monit

# 使用 Glances
sudo pip install glances
glances
```

**应用监控**:
- PM2 Keymetrics
- New Relic
- DataDog
- Sentry (错误追踪)

## 6. 备份和恢复

### 6.1 备份验证

**每周验证**:
```bash
# 1. 检查备份文件存在性
ls -lh /var/backups/stdmaterial/

# 2. 验证备份文件完整性
tar -tzf /var/backups/stdmaterial/uploads_*.tar.gz

# 3. 测试数据库备份
mongorestore --dryRun /var/backups/stdmaterial/db_*/stdmaterial
```

**每月恢复测试**:
```bash
# 1. 在测试环境恢复数据库
mongorestore --uri=mongodb://localhost:27017/test_db /var/backups/stdmaterial/db_*/stdmaterial

# 2. 验证数据完整性
mongosh test_db --eval "db.products.count()"

# 3. 清理测试数据
mongosh --eval "db.dropDatabase()" test_db
```

### 6.2 灾难恢复

**恢复流程**:

1. **评估损失**:
   - 确定故障范围
   - 评估数据丢失情况
   - 选择恢复时间点

2. **准备环境**:
   - 准备备用服务器
   - 安装必要软件
   - 配置网络

3. **恢复数据**:
   ```bash
   # 恢复数据库
   mongorestore --uri=mongodb://localhost:27017/stdmaterial /path/to/backup/db
   
   # 恢复文件
   tar -xzf /path/to/backup/uploads.tar.gz -C /var/www/html/stdmaterial.com/
   ```

4. **验证功能**:
   - 测试核心功能
   - 验证数据完整性
   - 检查外部集成

5. **切换流量**:
   - 更新 DNS
   - 验证服务可用
   - 监控性能

## 7. 文档维护

### 7.1 文档更新要求

**必须更新文档的情况**:
- 系统架构变更
- 新功能上线
- 配置变更
- 故障处理和解决方案
- 性能优化措施

### 7.2 文档审查周期

- **核心文档**: 每月审查
- **操作手册**: 每季度审查
- **API 文档**: 实时更新
- **故障手册**: 每次故障后更新

### 7.3 知识库管理

**分类管理**:
- 技术文档
- 操作手册
- 故障案例
- 最佳实践
- 培训材料

**版本控制**:
- 使用 Git 管理文档
- 添加修订历史
- 标记文档状态 (草稿/审核/发布)

## 8. 团队协作

### 8.1 值班安排

**值班职责**:
- 监控系统状态
- 处理紧急故障
- 记录值班日志
- 交接班沟通

**值班时间表**:
- 工作日：9:00-18:00 (现场值班)
- 夜间：18:00-9:00 (on-call)
- 周末：轮值 (on-call)

### 8.2 故障升级流程

**L1 - 一线支持**:
- 值班工程师
- 处理常见问题
- 记录故障工单

**L2 - 二线支持**:
- 资深工程师
- 处理复杂问题
- 协调资源

**L3 - 三线支持**:
- 技术负责人
- 处理重大故障
- 决策和资源调配

### 8.3 沟通渠道

**紧急情况**:
- 电话通知
- 短信告警
- 紧急会议

**日常沟通**:
- 工作群 (微信/钉钉)
- 邮件
- 项目管理工具

## 9. 持续改进

### 9.1 KPI 指标

**可用性**:
- 系统可用率: > 99.5%
- API 可用率: > 99.9%
- 页面加载时间: < 3 秒

**性能**:
- 平均响应时间: < 500ms
- 数据库查询时间: < 100ms
- 缓存命中率: > 80%

**质量**:
- 故障恢复时间 (MTTR): < 1 小时
- 故障间隔时间 (MTBF): > 30 天
- 客户满意度: > 95%

### 9.2 改进计划

**每月改进**:
- 分析故障案例
- 优化薄弱环节
- 更新文档和流程
- 团队培训

**季度改进**:
- 技术架构评审
- 性能基准测试
- 安全审计
- 容量规划

### 9.3 知识分享

**定期活动**:
- 技术分享会 (每月)
- 故障复盘会 (每次故障后)
- 代码审查会 (每周)
- 文档评审会 (每月)

**知识库建设**:
- 故障案例库
- 最佳实践库
- 技术文档库
- 培训视频库

---

**文档维护**: 技术部  
**最后更新**: 2026-03-21  
**下次审查**: 2026-06-21  
**紧急联系**: tech@stdmaterial.com
