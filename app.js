require('dotenv').config();
const express = require('express');
const path = require('path');

// 添加未捕获异常处理
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
});

console.log('Starting server initialization...');

try {
    // 检查路由文件是否存在
    console.log('Loading admin routes...');
    const adminRoutes = require('./routes/admin');
    const apiRoutes = require('./routes/api');
    console.log('Routes loaded successfully');

    // 创建 Express 应用
    const app = express();
    console.log('Express app created');

    // 配置中间件
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(path.join(__dirname, 'public')));
    console.log('Middleware configured');

    // 错误处理中间件
    const errorHandler = (err, req, res, next) => {
        console.error('Error:', err.stack);
        res.status(500).send('Something broke!');
    };

    // 注册API路由
    console.log('Registering API routes...');
    app.use('/api', apiRoutes);
    console.log('API routes registered');

    // 主页路由
    app.get('/', (req, res) => {
        console.log('Serving index page');
        res.sendFile(path.join(__dirname, 'views/index.html'));
    });

    // 注册管理员路由
    console.log('Registering admin routes...');
    app.use('/admin', adminRoutes);
    console.log('Admin routes registered');

    // 路由调试中间件
    app.use((req, res, next) => {
        console.log('Request received:', req.method, req.url);
        next();
    });

    // 404 处理
    app.use((req, res) => {
        console.log('404 for url:', req.url);
        res.status(404).send('Page not found');
    });

    // 错误处理中间件
    app.use(errorHandler);

    // 启动服务器
    const PORT = process.env.PORT || 3000;
    const server = app.listen(PORT, () => {
        console.log('=================================');
        console.log(`Server is running on port ${PORT}`);
        console.log(`Admin login available at http://localhost:${PORT}/admin/login`);
        console.log('=================================');
    });

    // 添加服务器错误处理
    server.on('error', (error) => {
        console.error('Server error:', error);
    });

} catch (error) {
    console.error('Server initialization error:', error);
    console.error('Error stack:', error.stack);
    process.exit(1);
} 