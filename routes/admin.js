const express = require('express');
const router = express.Router();
const path = require('path');

// 调试日志中间件
router.use((req, res, next) => {
    console.log('Admin route accessed:', req.method, req.url);
    next();
});

// 管理员登录页面
router.get('/login', (req, res) => {
    try {
        const loginPath = path.resolve(__dirname, '../views/admin/login.html');
        console.log('Attempting to serve login page from:', loginPath);
        
        // 检查文件是否存在
        const fs = require('fs');
        if (fs.existsSync(loginPath)) {
            console.log('Login file exists, sending file...');
            res.sendFile(loginPath);
        } else {
            console.error('Login file does not exist at path:', loginPath);
            res.status(404).send('Login page not found');
        }
    } catch (error) {
        console.error('Error serving login page:', error);
        res.status(500).send('Internal server error');
    }
});

// 管理员面板页面
router.get('/dashboard', (req, res) => {
    try {
        const dashboardPath = path.resolve(__dirname, '../views/admin/dashboard.html');
        console.log('Attempting to serve dashboard from:', dashboardPath);
        
        const fs = require('fs');
        if (fs.existsSync(dashboardPath)) {
            console.log('Dashboard file exists, sending file...');
            res.sendFile(dashboardPath);
        } else {
            console.error('Dashboard file does not exist at path:', dashboardPath);
            res.status(404).send('Dashboard page not found');
        }
    } catch (error) {
        console.error('Error serving dashboard page:', error);
        res.status(500).send('Internal server error');
    }
});

// 退出登录API
router.post('/logout', (req, res) => {
    // 清除session或其他登录状态
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ success: false, message: '退出失败' });
        }
        res.json({ success: true });
    });
});

module.exports = router; 