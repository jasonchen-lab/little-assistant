const axios = require('axios');
const settings = require('../models/settings');

class WenxinService {
    // 获取访问令牌
    static async getAccessToken() {
        try {
            const config = settings.getSettings();
            if (!config.apiKey || !config.secretKey) {
                throw new Error('未配置API密钥');
            }

            const response = await axios.post(
                'https://aip.baidubce.com/oauth/2.0/token',
                null,
                {
                    params: {
                        grant_type: 'client_credentials',
                        client_id: config.apiKey,
                        client_secret: config.secretKey
                    }
                }
            );

            if (!response.data.access_token) {
                throw new Error('获取访问令牌失败');
            }

            return response.data.access_token;
        } catch (error) {
            console.error('获取访问令牌失败:', error);
            throw error;
        }
    }

    // 调用文心一言API
    static async chat(messages) {
        try {
            console.log('Starting chat with messages:', messages);
            
            // 获取访问令牌
            const accessToken = await this.getAccessToken();
            console.log('Got access token');

            // 构建请求数据
            const requestData = {
                messages: messages,
                temperature: 0.7,
                top_p: 0.8,
                stream: false
            };

            console.log('Request data:', requestData);

            // 发送请求
            const response = await axios.post(
                'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions_pro',
                requestData,
                {
                    params: {
                        access_token: accessToken
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('API Response:', response.data);

            if (!response.data || !response.data.result) {
                throw new Error('API返回数据格式不正确');
            }

            return {
                success: true,
                result: response.data.result
            };

        } catch (error) {
            console.error('文心一言API调用失败:', error);
            if (error.response) {
                // API错误响应
                console.error('API Error Response:', error.response.data);
                const errorMsg = error.response.data.error_msg || error.response.data.error_description || '未知错误';
                throw new Error(`API错误: ${errorMsg}`);
            } else if (error.request) {
                // 网络错误
                throw new Error('网络连接失败，请检查网络');
            } else {
                // 其他错误
                throw error;
            }
        }
    }

    // 优化主旨
    static async optimizeTheme(theme, maxLength) {
        try {
            // 获取保存的提示词模板
            const promptTemplate = settings.getPromptTemplate('theme');
            if (!promptTemplate) {
                throw new Error('请先在管理面板设置主旨优化提示词');
            }

            // 替换变量
            const prompt = promptTemplate
                .replace('{theme}', theme)
                .replace('{maxLength}', maxLength);

            const response = await this.chat([{
                role: 'user',
                content: prompt
            }]);

            // 处理返回的结果
            const suggestions = response.result
                .split('\n')
                .filter(line => line.trim() && /^\d\./.test(line))
                .map(line => line.replace(/^\d\./, '').trim());

            return {
                success: true,
                suggestions: suggestions.length > 0 ? suggestions : ['AI未能生成有效建议，请重试']
            };
        } catch (error) {
            console.error('主旨优化失败:', error);
            throw error;
        }
    }

    // 优化标题
    static async optimizeTitle(title, theme, maxLength) {
        try {
            // 获取保存的提示词模板
            const promptTemplate = settings.getPromptTemplate('title');
            if (!promptTemplate) {
                throw new Error('请先在管理面板设置标题优化提示词');
            }

            // 替换变量
            const prompt = promptTemplate
                .replace('{title}', title)
                .replace('{theme}', theme)
                .replace('{maxLength}', maxLength);

            const response = await this.chat([{
                role: 'user',
                content: prompt
            }]);

            // 处理返回的结果
            const suggestions = response.result
                .split('\n')
                .filter(line => line.trim() && /^\d\./.test(line))
                .map(line => line.replace(/^\d\./, '').trim());

            return {
                success: true,
                suggestions: suggestions.length > 0 ? suggestions : ['AI未能生成有效建议，请重试']
            };
        } catch (error) {
            console.error('标题优化失败:', error);
            throw error;
        }
    }
}

module.exports = WenxinService; 