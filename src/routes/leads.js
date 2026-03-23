import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const __dirname = path.dirname(new URL(import.meta.url).pathname);

const readJsonFile = (filename) => {
  try {
    const filePath = path.join(__dirname, '../../data', filename);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify({ leads: [] }, null, 2));
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return { leads: [] };
  }
};

const writeJsonFile = (filename, data) => {
  try {
    const filePath = path.join(__dirname, '../../data', filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
};

// 提交低门槛线索（下载产品选型手册）
router.post('/low', (req, res) => {
  const { name, email, company } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({
      status: 'error',
      message: 'Name and email are required'
    });
  }
  
  const leadsData = readJsonFile('leads.json');
  const newLead = {
    id: Date.now().toString(),
    name,
    email,
    company: company || '',
    type: 'low',
    request: 'Download product selection manual',
    timestamp: new Date().toISOString()
  };
  
  leadsData.leads.push(newLead);
  writeJsonFile('leads.json', leadsData);
  
  res.json({
    status: 'success',
    message: 'Thank you for your request. The product selection manual has been sent to your email.',
    data: newLead
  });
});

// 提交中门槛线索（使用在线模拟器生成报告）
router.post('/medium', (req, res) => {
  const { name, email, company, industry, application, parameters } = req.body;
  
  if (!name || !email || !industry || !application || !parameters) {
    return res.status(400).json({
      status: 'error',
      message: 'Name, email, industry, application, and parameters are required'
    });
  }
  
  const leadsData = readJsonFile('leads.json');
  const newLead = {
    id: Date.now().toString(),
    name,
    email,
    company: company || '',
    type: 'medium',
    request: 'Generate simulator report',
    industry,
    application,
    parameters,
    timestamp: new Date().toISOString()
  };
  
  leadsData.leads.push(newLead);
  writeJsonFile('leads.json', leadsData);
  
  res.json({
    status: 'success',
    message: 'Thank you for your request. The simulation report has been generated and sent to your email.',
    data: newLead
  });
});

// 提交高门槛线索（获取详细报价单）
router.post('/high', (req, res) => {
  const { name, email, company, phone, industry, application, productModel, quantity, specifications, budget } = req.body;
  
  if (!name || !email || !company || !phone || !industry || !application || !productModel) {
    return res.status(400).json({
      status: 'error',
      message: 'Name, email, company, phone, industry, application, and product model are required'
    });
  }
  
  const leadsData = readJsonFile('leads.json');
  const newLead = {
    id: Date.now().toString(),
    name,
    email,
    company,
    phone,
    type: 'high',
    request: 'Get detailed quote',
    industry,
    application,
    productModel,
    quantity: quantity || 1,
    specifications: specifications || '',
    budget: budget || '',
    timestamp: new Date().toISOString()
  };
  
  leadsData.leads.push(newLead);
  writeJsonFile('leads.json', leadsData);
  
  res.json({
    status: 'success',
    message: 'Thank you for your request. Our sales team will contact you with a detailed quote within 24 hours.',
    data: newLead
  });
});

// 获取所有线索
router.get('/', (req, res) => {
  const leadsData = readJsonFile('leads.json');
  res.json({
    status: 'success',
    data: leadsData.leads
  });
});

export default router;