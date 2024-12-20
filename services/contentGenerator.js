const wenxin = require('./wenxin');
const settings = require('../models/settings');

class ContentGenerator {
    // 收集所有输入信息
    static validateAndCollectInputs(data) {
        console.log('Validating inputs:', data);
        const requiredFields = [
            'theme', 'title', 'purpose', 'wordCount', 
            'reader', 'approach', 'style', 'structure'
        ];

        // 验证必填字段
        for (const field of requiredFields) {
            if (!data[field]) {
                throw new Error(`${field} 是必填项`);
            }
        }

        // 验证字数限制
        if (data.wordCount < 500 || data.wordCount > 50000) {
            throw new Error('字数要求必须在500-50000之间');
        }

        const validatedInputs = {
            theme: data.theme.trim(),
            title: data.title.trim(),
            purpose: data.purpose.trim(),
            wordCount: parseInt(data.wordCount),
            reader: data.reader.trim(),
            approach: data.approach.trim(),
            style: data.style.trim(),
            structure: data.structure.trim(),
            references: (data.references || []).filter(ref => ref.trim()).join('\n\n')
        };

        console.log('Validated inputs:', validatedInputs);
        return validatedInputs;
    }

    // 生成文案
    static async generateContent(inputs) {
        try {
            // 获取生成提示词模板
            const promptTemplate = settings.getPromptTemplate('generate');
            if (!promptTemplate) {
                throw new Error('请先在管理面板设置文案生成提示词');
            }
            console.log('Using prompt template:', promptTemplate);

            // 替换模板变量
            const prompt = promptTemplate
                .replace('{{theme}}', inputs.theme)
                .replace('{{title}}', inputs.title)
                .replace('{{purpose}}', inputs.purpose)
                .replace('{{wordCount}}', inputs.wordCount)
                .replace('{{reader}}', inputs.reader)
                .replace('{{approach}}', inputs.approach)
                .replace('{{style}}', inputs.style)
                .replace('{{structure}}', inputs.structure)
                .replace('{{references}}', inputs.references);

            console.log('Generated prompt:', prompt);

            // 检查API配置
            const apiSettings = settings.getSettings();
            if (!apiSettings.apiKey || !apiSettings.secretKey) {
                throw new Error('未配置API密钥，请先在管理面板配置API');
            }

            // 调用AI服务
            console.log('Calling AI service...');
            const response = await wenxin.chat([{
                role: 'user',
                content: prompt
            }]);

            console.log('AI service response:', response);

            if (!response || !response.result) {
                throw new Error('AI服务返回的数据格式不正确');
            }

            return {
                success: true,
                content: response.result
            };

        } catch (error) {
            console.error('生成文案失败:', error);
            throw error;
        }
    }

    // 检查默认提示词
    static getDefaultPrompt() {
        return `根据以下信息生成一篇文案：

1. 主旨：{{theme}}
2. 标题：{{title}}
3. 用途：{{purpose}}
4. 字数要求：{{wordCount}}字
5. 目标读者：{{reader}}
6. 技术流派：{{approach}}
7. 写作风格：{{style}}
8. 文章结构：{{structure}}
9. 参考范文：{{references}}

要求：
1. 严格按照指定的文章结构来组织内容
2. 符合目标读者的阅读习惯和理解水平
3. 运用指定的技术流派的核心理念
4. 保持指定的写作风格
5. 确保文案主旨明确、论述有力
6. 适当借鉴参考范文的优秀写作特点`;
    }
}

module.exports = ContentGenerator; 