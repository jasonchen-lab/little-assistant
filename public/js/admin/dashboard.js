// 自动调整文本框高度
function autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

document.addEventListener('DOMContentLoaded', () => {
    // 加载API设置
    loadAPISettings();
    // 加载提示词设置
    loadPromptSettings();
    // 加载使用统计
    loadUsageStats();

    // API设置表单提交
    document.getElementById('apiForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const provider = formData.get('apiProvider');
        
        let settings = {
            provider: provider,
            apiKey: formData.get('apiKey'),
            secretKey: formData.get('secretKey'),
            modelVersion: formData.get('modelVersion')
        };

        try {
            const response = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(settings)
            });
            
            if (response.ok) {
                alert('API设置已保存');
            } else {
                throw new Error('保存失败');
            }
        } catch (error) {
            alert('保存设置失败：' + error.message);
        }
    });

    // 保存提示词
    document.getElementById('saveThemePrompt').addEventListener('click', async () => {
        const prompt = document.getElementById('themePrompt').value;
        
        try {
            const response = await fetch('/api/admin/prompts/theme', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt })
            });
            
            if (response.ok) {
                alert('提示词已保存');
            } else {
                throw new Error('保存失败');
            }
        } catch (error) {
            alert('保存提示词失败：' + error.message);
        }
    });

    // 保存标题提示词
    document.getElementById('saveTitlePrompt').addEventListener('click', async () => {
        const prompt = document.getElementById('titlePrompt').value;
        
        try {
            const response = await fetch('/api/admin/prompts/title', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt })
            });
            
            if (response.ok) {
                alert('提示词已保存');
            } else {
                throw new Error('保存失败');
            }
        } catch (error) {
            alert('保存提示词失败：' + error.message);
        }
    });

    // 退出登录
    document.getElementById('logoutBtn').addEventListener('click', async () => {
        try {
            await fetch('/api/admin/logout', { method: 'POST' });
            window.location.href = '/';
        } catch (error) {
            alert('退出失败：' + error.message);
        }
    });

    // API提供商切换逻辑
    document.getElementById('apiProvider').addEventListener('change', function() {
        const provider = this.value;
        
        // 隐藏所有配置
        document.querySelectorAll('.provider-config').forEach(el => {
            el.style.display = 'none';
        });
        
        // 显示对应提供商的配置
        switch(provider) {
            case 'baidu':
                document.getElementById('baiduConfig').style.display = 'block';
                break;
            case 'aliyun':
                document.getElementById('aliyunConfig').style.display = 'block';
                break;
            default:
                document.getElementById('commonConfig').style.display = 'block';
                break;
        }
    });

    // 为所有文本框添加自动调整高度功能
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        autoResizeTextarea(textarea);
        textarea.addEventListener('input', () => {
            autoResizeTextarea(textarea);
        });
        window.addEventListener('resize', () => {
            autoResizeTextarea(textarea);
        });
        const observer = new MutationObserver(() => {
            autoResizeTextarea(textarea);
        });
        observer.observe(textarea, { 
            attributes: true, 
            attributeFilter: ['value'] 
        });
    });
});

// 加载API设置
async function loadAPISettings() {
    try {
        const response = await fetch('/api/admin/settings');
        if (response.ok) {
            const settings = await response.json();
            
            // 设置选中的提供商
            document.getElementById('apiProvider').value = settings.provider;
            
            // 根据提供商显示对应的配置区域
            document.querySelectorAll('.provider-config').forEach(el => {
                el.style.display = 'none';
            });

            // 根据不同提供商设置对应的值
            switch(settings.provider) {
                case 'baidu':
                    document.getElementById('baiduConfig').style.display = 'block';
                    document.getElementById('apiKey').value = settings.apiKey;
                    document.getElementById('secretKey').value = settings.secretKey;
                    document.getElementById('modelVersion').value = settings.modelVersion;
                    break;
                case 'aliyun':
                    document.getElementById('aliyunConfig').style.display = 'block';
                    document.getElementById('aliyunApiKey').value = settings.apiKey;
                    document.getElementById('aliyunSecretKey').value = settings.secretKey;
                    break;
                default:
                    document.getElementById('commonConfig').style.display = 'block';
                    document.getElementById('commonApiKey').value = settings.apiKey;
                    document.getElementById('commonSecretKey').value = settings.secretKey;
                    break;
            }
        }
    } catch (error) {
        console.error('加载API设置失败:', error);
    }
}

// 加载提示词设置
async function loadPromptSettings() {
    try {
        const response = await fetch('/api/admin/prompts/theme');
        if (response.ok) {
            const { prompt } = await response.json();
            const themePrompt = document.getElementById('themePrompt');
            themePrompt.value = prompt;
            autoResizeTextarea(themePrompt);
        }
    } catch (error) {
        console.error('加载提示词失败:', error);
    }
}

// 加载使用统计
async function loadUsageStats() {
    try {
        const response = await fetch('/api/admin/stats');
        if (response.ok) {
            const stats = await response.json();
            document.getElementById('todayCalls').textContent = stats.todayCalls;
            document.getElementById('monthCalls').textContent = stats.monthCalls;
            document.getElementById('apiCost').textContent = `¥${stats.apiCost.toFixed(2)}`;
        }
    } catch (error) {
        console.error('加载使用统计失败:', error);
    }
}

// 显示对应的配置字段
function showProviderConfig(provider) {
    // 隐藏所有配置
    document.querySelectorAll('.provider-config').forEach(config => {
        config.classList.add('display-none');
    });

    // 显示选中的配置
    const configId = getConfigId(provider);
    const configElement = document.getElementById(configId);
    if (configElement) {
        configElement.classList.remove('display-none');
    }
} 