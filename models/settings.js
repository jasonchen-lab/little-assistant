const fs = require('fs');
const path = require('path');

// 配置文件路径
const CONFIG_FILE = path.join(__dirname, '../data/settings.json');

// 确保 data 目录存在
if (!fs.existsSync(path.dirname(CONFIG_FILE))) {
    fs.mkdirSync(path.dirname(CONFIG_FILE), { recursive: true });
}

// 初始化配置
let settings = {
    apiSettings: {
        provider: '',
        apiKey: '',
        secretKey: '',
        endpoint: '',
        modelVersion: ''
    },
    promptTemplates: {
        theme: '',
        title: '',
        generate: ''
    }
};

// 加载保存的配置
function loadSettings() {
    try {
        if (fs.existsSync(CONFIG_FILE)) {
            const data = fs.readFileSync(CONFIG_FILE, 'utf8');
            const loadedSettings = JSON.parse(data);
            settings = {
                apiSettings: {
                    ...settings.apiSettings,
                    ...loadedSettings.apiSettings
                },
                promptTemplates: {
                    ...settings.promptTemplates,
                    ...loadedSettings.promptTemplates
                }
            };
            console.log('Loaded settings:', settings);
        }
    } catch (error) {
        console.error('加载配置文件失败:', error);
    }
}

// 初始加载配置
loadSettings();

// 保存配置到文件
function saveSettings() {
    try {
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(settings, null, 2));
        console.log('Settings saved successfully');
    } catch (error) {
        console.error('保存配置文件失败:', error);
        throw error;
    }
}

// 获取提示词模板
function getPromptTemplate(type) {
    console.log(`Getting ${type} prompt template`);
    const template = settings.promptTemplates[type];
    if (!template) {
        throw new Error(`请先在管理面板设置${type}提示词`);
    }
    return template;
}

// 保存提示词模板
function savePromptTemplate(type, template) {
    console.log(`Saving ${type} prompt template:`, template);
    settings.promptTemplates[type] = template;
    saveSettings();
}

module.exports = {
    getSettings: () => settings.apiSettings,
    updateSettings: (newSettings) => {
        settings.apiSettings = { ...settings.apiSettings, ...newSettings };
        saveSettings();
    },
    getPromptTemplate,
    savePromptTemplate,
    loadSettings // 导出加载函数以便需要时重新加载
}; 