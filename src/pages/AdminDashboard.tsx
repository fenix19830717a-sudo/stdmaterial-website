import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    orders: { total: 0, pending: 0, processing: 0, shipped: 0, delivered: 0 },
    customers: { total: 0, active: 0, new: 0, returning: 0 },
    analytics: { pageViews: 0, uniqueVisitors: 0, bounceRate: 0, avgSessionDuration: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检查是否有token
    const token = localStorage.getItem('adminToken');
    if (!token) {
      window.location.href = '/admin/login';
      return;
    }

    // 获取统计数据
    const fetchStats = async () => {
      try {
        const [ordersRes, customersRes, analyticsRes] = await Promise.all([
          axios.get('/api/orders/stats'),
          axios.get('/api/customers/stats'),
          axios.get('/api/analytics')
        ]);

        setStats({
          orders: ordersRes.data.data,
          customers: customersRes.data.data,
          analytics: analyticsRes.data.data
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-deep-navy flex items-center justify-center">
        <div className="text-primary text-4xl">
          <span className="material-symbols-outlined animate-spin">sync</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-navy text-slate-100">
      {/* 侧边栏 */}
      <div className="flex">
        <div className="w-64 bg-surface-dark border-r border-white/10 h-screen fixed">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/20 border border-primary/50 rounded flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-sm">admin_panel_settings</span>
              </div>
              <span className="text-xl font-bold text-white">Admin Panel</span>
            </div>
          </div>

          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <a href="/admin/dashboard" className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 text-primary font-medium">
                  <span className="material-symbols-outlined text-sm">dashboard</span>
                  <span>Dashboard</span>
                </a>
              </li>
              <li>
                <a href="/admin/orders" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 text-slate-300 hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-sm">receipt_long</span>
                  <span>Orders</span>
                </a>
              </li>
              <li>
                <a href="/admin/customers" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 text-slate-300 hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-sm">people</span>
                  <span>Customers</span>
                </a>
              </li>
              <li>
                <a href="/admin/products" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 text-slate-300 hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-sm">inventory</span>
                  <span>Products</span>
                </a>
              </li>
              <li>
                <a href="/admin/analytics" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 text-slate-300 hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-sm">analytics</span>
                  <span>Analytics</span>
                </a>
              </li>
              <li>
                <a href="/admin/content" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 text-slate-300 hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-sm">content_copy</span>
                  <span>Content</span>
                </a>
              </li>
            </ul>
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
            <button onClick={handleLogout} className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors w-full">
              <span className="material-symbols-outlined text-sm">logout</span>
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* 主内容 */}
        <div className="flex-1 ml-64 p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-slate-400">Welcome to the administration panel</p>
          </div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="glass-panel p-6 rounded-xl border border-white/10">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-slate-400 text-sm">Total Orders</p>
                  <h3 className="text-3xl font-bold text-white">{stats.orders.total}</h3>
                </div>
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-sm">receipt_long</span>
                </div>
              </div>
              <div className="flex items-center text-xs text-green-400">
                <span className="material-symbols-outlined text-xs mr-1">trending_up</span>
                <span>12% increase</span>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-xl border border-white/10">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-slate-400 text-sm">Total Customers</p>
                  <h3 className="text-3xl font-bold text-white">{stats.customers.total}</h3>
                </div>
                <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-sm">people</span>
                </div>
              </div>
              <div className="flex items-center text-xs text-green-400">
                <span className="material-symbols-outlined text-xs mr-1">trending_up</span>
                <span>8% increase</span>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-xl border border-white/10">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-slate-400 text-sm">Page Views</p>
                  <h3 className="text-3xl font-bold text-white">{stats.analytics.pageViews}</h3>
                </div>
                <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center text-success">
                  <span className="material-symbols-outlined text-sm">visibility</span>
                </div>
              </div>
              <div className="flex items-center text-xs text-green-400">
                <span className="material-symbols-outlined text-xs mr-1">trending_up</span>
                <span>24% increase</span>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-xl border border-white/10">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-slate-400 text-sm">Pending Orders</p>
                  <h3 className="text-3xl font-bold text-white">{stats.orders.pending}</h3>
                </div>
                <div className="w-10 h-10 bg-warning/20 rounded-full flex items-center justify-center text-warning">
                  <span className="material-symbols-outlined text-sm">pending_actions</span>
                </div>
              </div>
              <div className="flex items-center text-xs text-yellow-400">
                <span className="material-symbols-outlined text-xs mr-1">schedule</span>
                <span>Needs attention</span>
              </div>
            </div>
          </div>

          {/* 订单状态 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="glass-panel p-6 rounded-xl border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">Order Status</h3>
              <div className="space-y-4">
                {Object.entries(stats.orders).map(([key, value]) => {
                  if (key === 'total') return null;
                  return (
                    <div key={key}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-slate-400 capitalize">{key}</span>
                        <span className="text-sm font-medium text-white">{value}</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${key === 'pending' ? 'bg-warning' : key === 'processing' ? 'bg-primary' : key === 'shipped' ? 'bg-secondary' : 'bg-success'}`}
                          style={{ width: `${(value / stats.orders.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="glass-panel p-6 rounded-xl border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">Customer Stats</h3>
              <div className="space-y-4">
                {Object.entries(stats.customers).map(([key, value]) => {
                  return (
                    <div key={key}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-slate-400 capitalize">{key}</span>
                        <span className="text-sm font-medium text-white">{value}</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${(value / stats.customers.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 最近活动 */}
          <div className="glass-panel p-6 rounded-xl border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary flex-shrink-0">
                  <span className="material-symbols-outlined text-sm">receipt_long</span>
                </div>
                <div>
                  <p className="text-white font-medium">New order received</p>
                  <p className="text-slate-400 text-sm">Order #ORD-12345 has been placed</p>
                  <p className="text-slate-500 text-xs mt-1">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors">
                <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center text-success flex-shrink-0">
                  <span className="material-symbols-outlined text-sm">person_add</span>
                </div>
                <div>
                  <p className="text-white font-medium">New customer registered</p>
                  <p className="text-slate-400 text-sm">John Doe has created an account</p>
                  <p className="text-slate-500 text-xs mt-1">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors">
                <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center text-secondary flex-shrink-0">
                  <span className="material-symbols-outlined text-sm">inventory</span>
                </div>
                <div>
                  <p className="text-white font-medium">Product updated</p>
                  <p className="text-slate-400 text-sm">Planetary Ball Mill PM-400 has been updated</p>
                  <p className="text-slate-500 text-xs mt-1">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;