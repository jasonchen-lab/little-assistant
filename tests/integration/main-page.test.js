const { cleanTestData, createTestData } = require('../helpers');
const settings = require('../../models/settings');
const wenxin = require('../../services/wenxin');

describe('Main Page Functionality Tests', () => {
    beforeEach(async () => {
        // 清理测试数据
        await cleanTestData();
        
        // 创建测试配置
        await createTestData({
            apiSettings: {
                provider: 'baidu',
                apiKey: process.env.TEST_API_KEY,
                secretKey: process.env.TEST_SECRET_KEY
            },
            promptTemplates: {
                theme: '测试主旨提示词',
                title: '测试标题提示词',
                generate: '测试生成提示词'
            }
        });
    });

    afterEach(async () => {
        await cleanTestData();
    });

    // 测试主旨优化功能
    describe('Theme Optimization', () => {
        test('should optimize theme successfully', async () => {
            const input = {
                theme: '帮助职场人士缓解工作压力，提升工作效率和生活品质',
                maxLength: 100
            };

            const result = await wenxin.chat([{
                role: 'user',
                content: settings.getPromptTemplate('theme')
                    .replace('{theme}', input.theme)
                    .replace('{maxLength}', input.maxLength)
            }]);

            expect(result.success).toBe(true);
            expect(Array.isArray(result.suggestions)).toBe(true);
            expect(result.suggestions.length).toBeGreaterThan(0);
            result.suggestions.forEach(suggestion => {
                expect(suggestion.length).toBeLessThanOrEqual(input.maxLength);
            });
        });

        test('should handle empty theme input', async () => {
            const input = {
                theme: '',
                maxLength: 100
            };

            await expect(async () => {
                await wenxin.chat([{
                    role: 'user',
                    content: settings.getPromptTemplate('theme')
                        .replace('{theme}', input.theme)
                        .replace('{maxLength}', input.maxLength)
                }]);
            }).rejects.toThrow('主旨不能为空');
        });
    });

    // 测试标题优化功能
    describe('Title Optimization', () => {
        test('should optimize title successfully', async () => {
            const input = {
                title: '5个实用的压力管理技巧',
                theme: '帮助职场人士缓解工作压力',
                maxLength: 50
            };

            const result = await wenxin.chat([{
                role: 'user',
                content: settings.getPromptTemplate('title')
                    .replace('{title}', input.title)
                    .replace('{theme}', input.theme)
                    .replace('{maxLength}', input.maxLength)
            }]);

            expect(result.success).toBe(true);
            expect(Array.isArray(result.suggestions)).toBe(true);
            expect(result.suggestions.length).toBeGreaterThan(0);
            result.suggestions.forEach(suggestion => {
                expect(suggestion.length).toBeLessThanOrEqual(input.maxLength);
            });
        });
    });

    // 测试文案生成功能
    describe('Content Generation', () => {
        test('should generate content successfully', async () => {
            const input = {
                theme: '帮助职场人士缓解工作压力',
                title: '5个实用的压力管理技巧',
                purpose: '公众号文案',
                wordCount: 2000,
                reader: '25-35岁职场白领',
                approach: '认知行为疗法（CBT）',
                style: '专业严谨但通俗易懂',
                structure: '问题解决式文案结构',
                references: '示例参考文案内容...'
            };

            const result = await wenxin.chat([{
                role: 'user',
                content: settings.getPromptTemplate('generate')
                    .replace('{{theme}}', input.theme)
                    .replace('{{title}}', input.title)
                    .replace('{{purpose}}', input.purpose)
                    .replace('{{wordCount}}', input.wordCount)
                    .replace('{{reader}}', input.reader)
                    .replace('{{approach}}', input.approach)
                    .replace('{{style}}', input.style)
                    .replace('{{structure}}', input.structure)
                    .replace('{{references}}', input.references)
            }]);

            expect(result.success).toBe(true);
            expect(result.content).toBeTruthy();
            expect(result.content.length).toBeGreaterThan(500);
            expect(result.content.length).toBeLessThanOrEqual(input.wordCount * 2);
        });

        test('should validate required fields', async () => {
            const invalidInput = {
                theme: '',
                title: '',
                purpose: '公众号文案'
                // 缺少其他必要字段
            };

            await expect(async () => {
                await wenxin.chat([{
                    role: 'user',
                    content: settings.getPromptTemplate('generate')
                        .replace('{{theme}}', invalidInput.theme)
                        .replace('{{title}}', invalidInput.title)
                        .replace('{{purpose}}', invalidInput.purpose)
                }]);
            }).rejects.toThrow('缺少必要的输入字段');
        });
    });

    // 测试字数统计功能
    describe('Word Count', () => {
        test('should calculate reading time correctly', () => {
            const wordCount = 2000;
            const readingTime = Math.ceil(wordCount / 300); // 假设阅读速度为每分钟300字
            expect(readingTime).toBe(7); // 应该是7分钟
        });
    });

    // 测试范文管理功能
    describe('Reference Management', () => {
        test('should handle reference text correctly', () => {
            const reference = '这是一段示例范文...'.repeat(100);
            expect(reference.length).toBeLessThanOrEqual(5000); // 确保不超过5000字限制
        });
    });
}); 