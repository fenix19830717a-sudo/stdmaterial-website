import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  totalCategories: number;
  activeCategories: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    activeProducts: 0,
    totalCategories: 0,
    activeCategories: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 这里应该调用API获取统计数据
        // 暂时使用模拟数据
        setTimeout(() => {
          setStats({
            totalProducts: 150,
            activeProducts: 120,
            totalCategories: 20,
            activeCategories: 18
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">仪表盘</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="text-3xl font-bold text-primary mb-2">{stats.totalProducts}</div>
          <div className="text-slate-400">总商品数</div>
        </div>
        <div className="card">
          <div className="text-3xl font-bold text-primary mb-2">{stats.activeProducts}</div>
          <div className="text-slate-400">活跃商品</div>
        </div>
        <div className="card">
          <div className="text-3xl font-bold text-primary mb-2">{stats.totalCategories}</div>
          <div className="text-slate-400">总分类数</div>
        </div>
        <div className="card">
          <div className="text-3xl font-bold text-primary mb-2">{stats.activeCategories}</div>
          <div className="text-slate-400">活跃分类</div>
        </div>
      </div>
      <div className="card mt-6">
        <div className="card-header">
          <h2 className="card-title">最近活动</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">商品添加</div>
              <div className="text-sm text-slate-400">添加了新商品: 行星球磨机</div>
            </div>
            <div className="text-sm text-slate-500">2分钟前</div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">分类更新</div>
              <div className="text-sm text-slate-400">更新了分类: 研磨设备</div>
            </div>
            <div className="text-sm text-slate-500">15分钟前</div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">商品删除</div>
              <div className="text-sm text-slate-400">删除了商品: 旧款破碎机</div>
            </div>
            <div className="text-sm text-slate-500">1小时前</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;