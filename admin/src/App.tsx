import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Settings from './pages/Settings';
import { Inventory2, Category, Settings as SettingsIcon, Home } from '@mui/icons-material';

const App: React.FC = () => {
  return (
    <Router>
      <div className="admin-container">
        <aside className="sidebar">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-primary">电商管理后台</h1>
          </div>
          <nav>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="nav-item">
                  <Home className="nav-item-icon" />
                  <span>仪表盘</span>
                </Link>
              </li>
              <li>
                <Link to="/products" className="nav-item">
                  <Inventory2 className="nav-item-icon" />
                  <span>商品管理</span>
                </Link>
              </li>
              <li>
                <Link to="/categories" className="nav-item">
                  <Category className="nav-item-icon" />
                  <span>分类管理</span>
                </Link>
              </li>
              <li>
                <Link to="/settings" className="nav-item">
                  <SettingsIcon className="nav-item-icon" />
                  <span>系统设置</span>
                </Link>
              </li>
            </ul>
          </nav>
        </aside>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;