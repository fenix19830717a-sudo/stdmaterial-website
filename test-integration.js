import Integrator from './src/services/integrator.js';

async function testIntegration() {
  try {
    console.log('开始测试集成流程...');
    
    const integrator = new Integrator();
    
    // 运行测试
    await integrator.runTest();
    
    console.log('集成测试完成！');
  } catch (error) {
    console.error('测试过程中出错:', error);
  }
}

async function runIntegration() {
  try {
    console.log('开始完整集成流程...');
    
    const integrator = new Integrator();
    
    // 运行完整集成
    const products = await integrator.integrate();
    
    console.log(`完整集成完成！处理了 ${products.length} 个商品`);
  } catch (error) {
    console.error('集成过程中出错:', error);
  }
}

// 运行测试
if (process.argv[2] === '--test') {
  testIntegration();
} else {
  runIntegration();
}