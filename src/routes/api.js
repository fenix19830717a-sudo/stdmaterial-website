import express from 'express';
import { recommend, getProductParams } from '../utils/recommendEngine.js';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const __dirname = path.dirname(new URL(import.meta.url).pathname);

const readJsonFile = (filename) => {
  try {
    const filePath = path.join(__dirname, '../../data', filename);
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return null;
  }
};

router.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'admin@admin.com' && password === 'admin123') {
    res.json({
      status: 'success',
      data: {
        user: { email, role: 'admin' },
        token: 'mock-jwt-token-' + Date.now()
      }
    });
  } else {
    res.status(401).json({
      status: 'error',
      message: 'Invalid credentials'
    });
  }
});

router.get('/products', (req, res) => {
  const data = readJsonFile('products.json');
  if (data) {
    res.json({ status: 'success', data: data.products || data });
  } else {
    res.json({ status: 'success', data: [] });
  }
});

router.get('/products/:id', (req, res) => {
  const data = readJsonFile('products.json');
  const products = data?.products || data || [];
  const product = products.find(p => p.id === req.params.id);
  if (product) {
    res.json({ status: 'success', data: product });
  } else {
    res.status(404).json({ status: 'error', message: 'Product not found' });
  }
});

router.get('/orders', (req, res) => {
  const data = readJsonFile('orders.json');
  if (data) {
    res.json({ status: 'success', data: data.orders || data });
  } else {
    res.json({ status: 'success', data: [] });
  }
});

router.get('/orders/stats', (req, res) => {
  res.json({
    status: 'success',
    data: {
      total: 156,
      pending: 23,
      processing: 45,
      shipped: 38,
      delivered: 50,
      revenue: 125000
    }
  });
});

router.get('/orders/:id', (req, res) => {
  const data = readJsonFile('orders.json');
  const orders = data?.orders || data || [];
  const order = orders.find(o => o.id === req.params.id);
  if (order) {
    res.json({ status: 'success', data: order });
  } else {
    res.status(404).json({ status: 'error', message: 'Order not found' });
  }
});

router.get('/customers', (req, res) => {
  const data = readJsonFile('customers.json');
  if (data) {
    res.json({ status: 'success', data: data.customers || data });
  } else {
    res.json({ status: 'success', data: [] });
  }
});

router.get('/customers/stats', (req, res) => {
  res.json({
    status: 'success',
    data: {
      total: 89,
      active: 67,
      new: 12,
      returning: 78
    }
  });
});

router.get('/customers/:id', (req, res) => {
  const data = readJsonFile('customers.json');
  const customers = data?.customers || data || [];
  const customer = customers.find(c => c.id === req.params.id);
  if (customer) {
    res.json({ status: 'success', data: customer });
  } else {
    res.status(404).json({ status: 'error', message: 'Customer not found' });
  }
});

router.get('/analytics', (req, res) => {
  res.json({
    status: 'success',
    data: {
      pageViews: 12500,
      uniqueVisitors: 3200,
      bounceRate: 35.5,
      avgSessionDuration: 180,
      topPages: [
        { path: '/', views: 5000 },
        { path: '/products', views: 3200 },
        { path: '/about', views: 2100 },
        { path: '/contact', views: 1500 }
      ]
    }
  });
});

router.get('/content', (req, res) => {
  res.json({
    status: 'success',
    data: [
      { id: '1', title: '首页横幅', type: 'banner', status: 'active' },
      { id: '2', title: '产品介绍', type: 'section', status: 'active' },
      { id: '3', title: '公司简介', type: 'about', status: 'active' }
    ]
  });
});

router.post('/recommend', async (req, res) => {
  try {
    const query = req.body;
    const result = recommend(query);
    res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    console.error('Error in recommendation API:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

router.get('/products/params', async (req, res) => {
  try {
    const params = getProductParams();
    res.status(200).json({ status: 'success', data: params });
  } catch (error) {
    console.error('Error in product params API:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'API is running' });
});

export default router;