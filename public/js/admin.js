// 添加调试日志
console.log('Admin JS loaded');

// 自动调整文本框高度
function autoResizeTextarea(textarea) {
    if (!textarea) return;
    
    // 保存当前高度
    const originalHeight = textarea.style.height;
    
    // 临时设置高度为 auto 来获取实际内容高度
    textarea.style.height = 'auto';
    
    // 获取内容实际高度并添加一些额外空间
    const contentHeight = textarea.scrollHeight;
    const minHeight = parseInt(window.getComputedStyle(textarea).minHeight) || 100;
    const newHeight = Math.max(minHeight, contentHeight + 10);
    
    // 设置新高度
    textarea.style.height = `${newHeight}px`;
    
    // 如果高度没有变化，恢复原来的高度
    if (newHeight === parseInt(originalHeight)) {
        textarea.style.height = originalHeight;
    }
}

// 初始化函数
async function initializeAdmin() {
    console.log('Initializing admin panel');
    
    // 加载所有提示词
    await loadAllPrompts();
    
    // 绑定所有保存按钮事件
    bindSaveButtons();
    
    // 初始化所有文本框的自动调整高度功能
    initAllTextareas();
}

// 初始化所有文本框
function initAllTextareas() {
    const textareas = document.querySelectorAll('.prompt-editor textarea');
    textareas.forEach(textarea => {
        // 初始调整
        autoResizeTextarea(textarea);
        
        // 添加输入事件监听
        textarea.addEventListener('input', () => autoResizeTextarea(textarea));
        textarea.addEventListener('focus', () => autoResizeTextarea(textarea));
        textarea.addEventListener('change', () => autoResizeTextarea(textarea));
    });
}

// 加载所有提示词
async function loadAllPrompts() {
    try {
        // 加载主旨提示词
        const themeResponse = await fetch('/api/admin/prompts/theme');
        const themePrompt = document.getElementById('themePrompt');
        if (themeResponse.ok) {
            const data = await themeResponse.json();
            if (themePrompt && data.prompt) {
                themePrompt.value = data.prompt;
                autoResizeTextarea(themePrompt);
            }
        } else {
            themePrompt.placeholder = '请输入主旨优化提示词模板...';
        }

        // 加载标题提示词
        const titleResponse = await fetch('/api/admin/prompts/title');
        const titlePrompt = document.getElementById('titlePrompt');
        if (titleResponse.ok) {
            const data = await titleResponse.json();
            if (titlePrompt && data.prompt) {
                titlePrompt.value = data.prompt;
                autoResizeTextarea(titlePrompt);
            }
        } else {
            titlePrompt.placeholder = '请输入标题优化提示词模板...';
        }

        // 加载生成提示词
        const generateResponse = await fetch('/api/admin/prompts/generate');
        const generatePrompt = document.getElementById('generatePrompt');
        if (generateResponse.ok) {
            const data = await generateResponse.json();
            if (generatePrompt && data.prompt) {
                generatePrompt.value = data.prompt;
                autoResizeTextarea(generatePrompt);
            }
        } else {
            generatePrompt.placeholder = '请输入文案生成提示词模板...';
        }
    } catch (error) {
        console.error('加载提示词失败:', error);
    }
}

// 绑定保存按钮事件
function bindSaveButtons() {
    // 主旨提示词保存按钮
    const saveThemeButton = document.getElementById('saveThemePrompt');
    if (saveThemeButton) {
        saveThemeButton.addEventListener('click', () => savePrompt('theme', 'themePrompt'));
    }

    // 标题提示词保存按钮
    const saveTitleButton = document.getElementById('saveTitlePrompt');
    if (saveTitleButton) {
        saveTitleButton.addEventListener('click', () => savePrompt('title', 'titlePrompt'));
    }

    // 生成提示词保存按钮
    const saveGenerateButton = document.getElementById('saveGeneratePrompt');
    if (saveGenerateButton) {
        saveGenerateButton.addEventListener('click', () => savePrompt('generate', 'generatePrompt'));
    }
}

// 保存提示词通用函数
async function savePrompt(type, elementId) {
    console.log(`Saving ${type} prompt`);
    try {
        const prompt = document.getElementById(elementId).value;
        if (!prompt) {
            alert('提示词不能为空');
            return;
        }

        const response = await fetch(`/api/admin/prompts/${type}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt })
        });

        if (!response.ok) {
            throw new Error('保存失败');
        }

        alert('提示词保存成功');
    } catch (error) {
        console.error('保存提示词失败:', error);
        alert('保存失败，请重试');
    }
}

// 在页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initializeAdmin); 