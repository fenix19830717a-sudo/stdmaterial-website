import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectDB from '../config/database.js';
import productsRouter from './routes/products.js';
import categoriesRouter from './routes/categories.js';
import leadsRouter from './routes/leads.js';
import authRouter from './routes/auth.js';
import ordersRouter from './routes/orders.js';
import customersRouter from './routes/customers.js';
import analyticsRouter from './routes/analytics.js';

const app = express();
const PORT = process.env.PORT || 3001;

connectDB();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/leads', leadsRouter);
app.use('/api/auth', authRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/customers', customersRouter);
app.use('/api/analytics', analyticsRouter);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;