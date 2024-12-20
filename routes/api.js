const express = require('express');
const router = express.Router();
const adminConfig = require('../config/admin');
const wenxin = require('../services/wenxin');
const settings = require('../models/settings');
const prompts = require('../services/prompts');
const ContentGenerator = require('../services/contentGenerator');

// 管理员登录API
router.post('/admin/login', (req, res) => {
    console.log('Received login request:', req.body);  // 添加调试日志
    
    const { username, password } = req.body;
    
    // 验证请求数据
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: '用户名和密码不能为空'
        });
    }

    // 验证用户名和密码
    if (username === adminConfig.username && password === adminConfig.password) {
        console.log('Login successful');  // 添加调试日志
        res.json({
            success: true,
            message: '登录成功'
        });
    } else {
        console.log('Login failed');  // 添加调试日志
        res.status(401).json({
            success: false,
            message: '用户名或密码错误'
        });
    }
});

// 主旨优化API
router.post('/optimize-theme', async (req, res) => {
    try {
        const { theme, maxLength } = req.body;
        
        if (!theme) {
            throw new Error('主旨内容不能为空');
        }

        const result = await wenxin.optimizeTheme(theme, maxLength || 100);
        res.json(result);
    } catch (error) {
        console.error('优化失败:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// 标题优化API
router.post('/optimize-title', async (req, res) => {
    try {
        const { title, theme, maxLength } = req.body;
        
        if (!title) {
            throw new Error('标题不能为空');
        }

        const result = await wenxin.optimizeTitle(title, theme, maxLength || 50);
        res.json(result);
    } catch (error) {
        console.error('标题优化失败:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// 添加保存设置的路由
router.post('/admin/settings', (req, res) => {
    try {
        const { provider, apiKey, secretKey, modelVersion } = req.body;
        
        // 更新设置
        settings.updateSettings({
            provider,
            apiKey,
            secretKey,
            modelVersion
        });

        res.json({
            success: true,
            message: '设置保存'
        });
    } catch (error) {
        console.error('保存设置失败:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// 添加获取设置的路由
router.get('/admin/settings', (req, res) => {
    try {
        const currentSettings = settings.getSettings();
        res.json(currentSettings);
    } catch (error) {
        console.error('获取设置失败:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// 保存主旨提示词
router.post('/admin/prompts/theme', (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            throw new Error('提示词不能为空');
        }
        
        settings.savePromptTemplate('theme', prompt);
        
        res.json({
            success: true,
            message: '提示词已保存'
        });
    } catch (error) {
        console.error('保存提示词失败:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// 获取主旨提示词
router.get('/admin/prompts/theme', (req, res) => {
    try {
        const prompt = settings.getPromptTemplate('theme');
        if (!prompt) {
            throw new Error('请先在管理面板设置主旨优化提示词');
        }
        res.json({
            success: true,
            prompt
        });
    } catch (error) {
        console.error('获取提示词失败:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// 获取标题提示词
router.get('/admin/prompts/title', (req, res) => {
    try {
        const prompt = settings.getPromptTemplate('title');
        if (!prompt) {
            throw new Error('请先在管理面板设置标题优化提示词');
        }
        res.json({
            success: true,
            prompt
        });
    } catch (error) {
        console.error('获取提示词失败:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// 保存标题提示词
router.post('/admin/prompts/title', (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            throw new Error('提示词不能为空');
        }
        
        settings.savePromptTemplate('title', prompt);
        
        res.json({
            success: true,
            message: '提示词已保存'
        });
    } catch (error) {
        console.error('保存提示词失败:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// 保存文案生成提示词
router.post('/admin/prompts/generate', (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            throw new Error('提示词不能为空');
        }
        
        settings.savePromptTemplate('generate', prompt);
        
        res.json({
            success: true,
            message: '提示词已保存'
        });
    } catch (error) {
        console.error('保存提示词失败:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// 获取文案生成提示词
router.get('/admin/prompts/generate', (req, res) => {
    try {
        const prompt = settings.getPromptTemplate('generate');
        if (!prompt) {
            throw new Error('请先在管理面板设置文案生成提示词');
        }
        res.json({
            success: true,
            prompt
        });
    } catch (error) {
        console.error('获取提示词失败:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// 生成文案
router.post('/generate-content', async (req, res) => {
    try {
        // 验证和收集输入
        const inputs = ContentGenerator.validateAndCollectInputs(req.body);
        
        // 生成文案
        const result = await ContentGenerator.generateContent(inputs);
        
        res.json(result);
    } catch (error) {
        console.error('生成文案失败:', error);
        res.status(400).json({
            success: false,
            message: error.message || '生成失败'
        });
    }
});

module.exports = router; 