import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
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

export default router;