// 提示词类型定义
const PromptTypes = {
    THEME: 'theme',      // 主旨优化
    TITLE: 'title',      // 标题优化
    GENERATE: 'generate' // 文案生成
};

// 提示词变量说明文档
const PromptVariables = {
    theme: {
        theme: '用户输入的主旨内容',
        maxLength: '最大字数限制'
    },
    title: {
        title: '用户输入的标题',
        theme: '文案主旨',
        maxLength: '最大字数限制'
    },
    generate: {
        theme: '文案主旨',
        title: '文案标题',
        purpose: '文案用途',
        wordCount: '字数要求',
        reader: '目标读者',
        approach: '技术流派',
        style: '写作风格',
        structure: '文章结构',
        references: '参考范文'
    }
};

module.exports = {
    PromptTypes,
    PromptVariables
}; 