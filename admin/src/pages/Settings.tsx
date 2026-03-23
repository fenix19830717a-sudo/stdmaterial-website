import React, { useState } from 'react';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    siteName: '电商管理系统',
    adminEmail: 'admin@example.com',
    perPage: 10,
    enableTranslation: true,
    enableImageProcessing: true
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // 模拟保存设置
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">系统设置</h1>
      
      {success && (
        <div className="alert alert-success mb-6">
          设置保存成功
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">基本设置</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="form-label">网站名称</label>
              <input
                type="text"
                className="form-input"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">管理员邮箱</label>
              <input
                type="email"
                className="form-input"
                value={settings.adminEmail}
                onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">每页显示数量</label>
              <input
                type="number"
                className="form-input"
                value={settings.perPage}
                onChange={(e) => setSettings({ ...settings, perPage: parseInt(e.target.value) || 10 })}
                min="1"
                max="100"
              />
            </div>
            <div className="form-group">
              <label className="form-label">启用自动翻译</label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableTranslation"
                  checked={settings.enableTranslation}
                  onChange={(e) => setSettings({ ...settings, enableTranslation: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="enableTranslation">启用</label>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">启用图片处理</label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableImageProcessing"
                  checked={settings.enableImageProcessing}
                  onChange={(e) => setSettings({ ...settings, enableImageProcessing: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="enableImageProcessing">启用</label>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? '保存中...' : '保存设置'}
            </button>
          </div>
        </form>
      </div>

      <div className="card mt-6">
        <div className="card-header">
          <h2 className="card-title">API设置</h2>
        </div>
        <div className="space-y-4">
          <div className="form-group">
            <label className="form-label">翻译API密钥</label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter translation API key"
            />
          </div>
          <div className="form-group">
            <label className="form-label">图片处理API密钥</label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter image processing API key"
            />
          </div>
          <div className="mt-4">
            <button className="btn btn-primary">测试API连接</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;