// 设置测试环境变量
process.env.NODE_ENV = 'test';
process.env.TEST_API_KEY = 'test_key';
process.env.TEST_SECRET_KEY = 'test_secret';

// 清理测试数据
beforeEach(async () => {
    // 清理测试数据库或文件
});

afterEach(async () => {
    // 清理测试数据
}); 