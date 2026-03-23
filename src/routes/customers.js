import express from 'express';

const router = express.Router();

router.get('/stats', (req, res) => {
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

router.get('/', (req, res) => {
  res.json({
    status: 'success',
    data: [
      { id: 'CUS-001', name: 'John Doe', email: 'john@example.com', orders: 5, totalSpent: 12500 },
      { id: 'CUS-002', name: 'Jane Smith', email: 'jane@example.com', orders: 3, totalSpent: 8200 },
      { id: 'CUS-003', name: 'Bob Johnson', email: 'bob@example.com', orders: 8, totalSpent: 21000 }
    ]
  });
});

router.get('/:id', (req, res) => {
  res.json({
    status: 'success',
    data: {
      id: req.params.id,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 234 567 8900',
      company: 'Tech Corp',
      orders: 5,
      totalSpent: 12500,
      createdAt: '2025-01-15'
    }
  });
});

export default router;