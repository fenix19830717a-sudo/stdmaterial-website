import express from 'express';

const router = express.Router();

router.post('/login', (req, res) => {
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

router.post('/logout', (req, res) => {
  res.json({
    status: 'success',
    message: 'Logged out successfully'
  });
});

router.get('/verify', (req, res) => {
  const token = req.headers.authorization;
  
  if (token && token.startsWith('mock-jwt-token-')) {
    res.json({
      status: 'success',
      data: { valid: true }
    });
  } else {
    res.status(401).json({
      status: 'error',
      message: 'Invalid token'
    });
  }
});

export default router;