import express from 'express';

const router = express.Router();

router.get('/stats', (req, res) => {
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

router.get('/', (req, res) => {
  res.json({
    status: 'success',
    data: [
      { id: 'ORD-001', customer: 'John Doe', total: 2500, status: 'pending', date: '2026-03-20' },
      { id: 'ORD-002', customer: 'Jane Smith', total: 1800, status: 'processing', date: '2026-03-19' },
      { id: 'ORD-003', customer: 'Bob Johnson', total: 3200, status: 'shipped', date: '2026-03-18' }
    ]
  });
});

router.get('/:id', (req, res) => {
  res.json({
    status: 'success',
    data: {
      id: req.params.id,
      customer: 'John Doe',
      email: 'john@example.com',
      total: 2500,
      status: 'pending',
      items: [
        { product: 'Planetary Ball Mill PM-400', quantity: 1, price: 2500 }
      ],
      date: '2026-03-20'
    }
  });
});

export default router;