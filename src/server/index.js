const express = require('express');
const path = require('path');
const app = express();

// 添加日志中间件
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// 设置静态文件目录
app.use(express.static(path.join(__dirname, '../../public')));

// 设置路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../views/index.html'));
});

// 添加错误处理
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Static files are served from: ${path.join(__dirname, '../../public')}`);
}); 